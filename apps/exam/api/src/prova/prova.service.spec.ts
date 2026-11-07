import { jest } from "@jest/globals";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ProvaService, calcularFimProva } from "./prova.service.js";
import { permutacaoAlternativas } from "./shuffle.js";

describe("calcularFimProva", () => {
  const as = (hhmm: string) => new Date(`2026-11-08T${hhmm}:00-03:00`);

  it("quem entra no horário tem a duração completa", () => {
    expect(calcularFimProva(as("08:30"), 150, as("11:00"), 0)).toEqual(as("11:00"));
  });

  it("quem entra atrasado termina no fechamento da janela", () => {
    expect(calcularFimProva(as("08:40"), 150, as("11:00"), 0)).toEqual(as("11:00"));
  });

  it("com 180 minutos, todos terminam às 11:30", () => {
    expect(calcularFimProva(as("08:30"), 180, as("11:30"), 0)).toEqual(as("11:30"));
    expect(calcularFimProva(as("09:00"), 180, as("11:30"), 0)).toEqual(as("11:30"));
  });

  it("o tempo extra soma depois do corte da janela", () => {
    expect(calcularFimProva(as("08:40"), 150, as("11:00"), 20)).toEqual(as("11:20"));
  });

  it("sem janela, vale só a duração", () => {
    expect(calcularFimProva(as("08:40"), 150, null, 0)).toEqual(as("11:10"));
  });
});

describe("ProvaService (exam-api)", () => {
  it("mantém a ordem do cadastro e embaralha só as alternativas", async () => {
    const q = (id: string) => ({
      questao: {
        id, enunciado: id, alternativaA: "a", alternativaB: "b", alternativaC: "c",
        alternativaD: "d", alternativaE: "e",
      },
    });
    const mock = {
      inscricao: {
        findFirst: jest.fn(async () => ({
          id: "i1", status: "CONFIRMADA", fase1Inicio: new Date(), fase1Fim: null,
          fase1TempoExtraMinutos: 0, fase1Advertencias: 0, edicaoId: "ed1",
        })),
      },
      prova: { findFirst: jest.fn(async () => ({ id: "p1", duracaoMinutos: 150, janelaFim: null })) },
      provaQuestao: { findMany: jest.fn(async () => ["q1", "q2", "q3", "q4", "q5"].map(q)) },
      resposta: { findMany: jest.fn(async () => []) },
    };

    const { questoes } = await new ProvaService(mock as any).buscarQuestoes("u1");

    expect(questoes.map((x: { id: string }) => x.id)).toEqual(["q1", "q2", "q3", "q4", "q5"]);
    const [p] = questoes;
    const textos = { A: "a", B: "b", C: "c", D: "d", E: "e" } as Record<string, string>;
    const esperado = permutacaoAlternativas("i1:q1").map((l) => textos[l]);
    expect([p.alternativaA, p.alternativaB, p.alternativaC, p.alternativaD, p.alternativaE]).toEqual(esperado);
  });

  let service: ProvaService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      inscricao: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      questao: { findUnique: jest.fn(), count: jest.fn(async () => 0) },
      prova: { findFirst: jest.fn() },
      provaQuestao: { findMany: jest.fn(), count: jest.fn() },
      resposta: { findMany: jest.fn(), groupBy: jest.fn(), upsert: jest.fn() },
    };
    service = new ProvaService(prisma as any);
  });

  it("sem gabarito oficial, finaliza sem nota em vez de dar zero", async () => {
    prisma.inscricao.findFirst.mockResolvedValue({ id: "i1", edicaoId: "ed1", fase1Fim: null });
    prisma.prova.findFirst.mockResolvedValue({ id: "p1" });
    prisma.resposta.groupBy.mockResolvedValue([]);
    prisma.provaQuestao.count.mockResolvedValue(20);
    prisma.questao.count.mockResolvedValue(20);
    prisma.inscricao.update.mockResolvedValue({ id: "i1" });

    await service.finalizarProva("u1");

    const { data } = prisma.inscricao.update.mock.calls[0][0];
    expect(data.fase1Nota).toBeNull();
    expect(data.fase1Fim).toEqual(expect.any(Date));
  });

  describe("estadoProva", () => {
    const inscricao = (conflito: Date | null) => ({
      edicaoId: "ed1", fase1Inicio: new Date(), fase1Fim: null, fase1TempoExtraMinutos: 0,
      fase1Advertencias: 0, user: { sessaoConflitoEm: conflito },
    });

    it("avisa sobre tentativa recente em outro aparelho", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(inscricao(new Date()));
      prisma.prova.findFirst.mockResolvedValue({ duracaoMinutos: 180, janelaFim: null });

      expect((await service.estadoProva("u1")).outroAparelho).toBe(true);
    });

    it("informa o motivo do encerramento", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        ...inscricao(null), fase1Fim: new Date(), fase1FimMotivo: "ADVERTENCIAS",
      });
      prisma.prova.findFirst.mockResolvedValue({ duracaoMinutos: 180, janelaFim: null });

      expect((await service.estadoProva("u1")).motivoFim).toBe("ADVERTENCIAS");
    });

    it("para de avisar quando as tentativas param", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(inscricao(new Date(Date.now() - 120_000)));
      prisma.prova.findFirst.mockResolvedValue({ duracaoMinutos: 180, janelaFim: null });

      expect((await service.estadoProva("u1")).outroAparelho).toBe(false);
    });
  });

  describe("registrarAdvertencia", () => {
    it("na terceira, o próprio servidor encerra a prova", async () => {
      prisma.inscricao.findFirst
        .mockResolvedValueOnce({ id: "i1" })
        .mockResolvedValue({ id: "i1", edicaoId: "ed1", fase1Fim: null });
      prisma.inscricao.update
        .mockResolvedValueOnce({ fase1Advertencias: 3 })
        .mockResolvedValue({ id: "i1" });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1" });
      prisma.resposta.groupBy.mockResolvedValue([]);
      prisma.provaQuestao.count.mockResolvedValue(20);

      await expect(service.registrarAdvertencia("u1")).resolves.toEqual({
        advertencias: 3,
        finalizada: true,
      });
      expect(prisma.inscricao.update.mock.calls[1][0].data.fase1FimMotivo).toBe("ADVERTENCIAS");
    });

    it("antes da terceira, só conta", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({ id: "i1" });
      prisma.inscricao.update.mockResolvedValue({ fase1Advertencias: 2 });

      await expect(service.registrarAdvertencia("u1")).resolves.toEqual({
        advertencias: 2,
        finalizada: false,
      });
      expect(prisma.inscricao.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("iniciarProva", () => {
    it("lança erro quando a inscrição não existe", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(null);
      await expect(service.iniciarProva("u1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro quando a inscrição não está CONFIRMADA", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({ id: "i1", status: "PENDENTE" });
      await expect(service.iniciarProva("u1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro quando a prova já foi finalizada", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", status: "CONFIRMADA", fase1Fim: new Date(), edicaoId: "ed1",
      });
      await expect(service.iniciarProva("u1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro quando a janela ainda não abriu", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", status: "CONFIRMADA", fase1Inicio: null, fase1Fim: null, edicaoId: "ed1",
      });
      prisma.prova.findFirst.mockResolvedValue({
        id: "p1", janelaInicio: new Date(Date.now() + 3600_000), janelaFim: null,
      });
      await expect(service.iniciarProva("u1")).rejects.toThrow(BadRequestException);
    });

    describe("limite para iniciar", () => {
      const inscricao = { id: "i1", status: "CONFIRMADA", fase1Fim: null, edicaoId: "ed1" };
      const prova = {
        id: "p1", status: "PUBLICADA", janelaInicio: new Date(Date.now() - 3 * 3600_000),
        janelaFim: new Date(Date.now() + 3600_000), limiteInicio: new Date(Date.now() - 60_000),
      };

      it("recusa quem ainda não começou depois do limite", async () => {
        prisma.inscricao.findFirst.mockResolvedValue({ ...inscricao, fase1Inicio: null });
        prisma.prova.findFirst.mockResolvedValue(prova);

        await expect(service.iniciarProva("u1")).rejects.toThrow(/prazo para iniciar/);
        expect(prisma.inscricao.update).not.toHaveBeenCalled();
      });

      it("deixa voltar quem começou antes do limite", async () => {
        prisma.inscricao.findFirst.mockResolvedValue({
          ...inscricao, fase1Inicio: new Date(Date.now() - 3600_000),
        });
        prisma.prova.findFirst.mockResolvedValue(prova);

        await expect(service.iniciarProva("u1")).resolves.toMatchObject({
          message: "Prova já em andamento",
        });
      });

      it("recusa iniciar prova encerrada", async () => {
        prisma.inscricao.findFirst.mockResolvedValue({ ...inscricao, fase1Inicio: null });
        prisma.prova.findFirst.mockResolvedValue({ ...prova, status: "ENCERRADA", limiteInicio: null });

        await expect(service.iniciarProva("u1")).rejects.toThrow(/encerrou/);
      });
    });

    it("só considera provas publicadas", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", status: "CONFIRMADA", fase1Inicio: null, fase1Fim: null, edicaoId: "ed1",
      });
      prisma.prova.findFirst.mockResolvedValue(null);

      await expect(service.iniciarProva("u1")).rejects.toThrow(BadRequestException);
      const consulta = prisma.prova.findFirst.mock.calls[0][0];
      expect(consulta.where.status.in).not.toContain("RASCUNHO");
      expect(consulta.orderBy).toEqual({ publicadaEm: { sort: "desc", nulls: "last" } });
    });

    it("registra o início e retorna sucesso na primeira chamada", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", status: "CONFIRMADA", fase1Inicio: null, fase1Fim: null, edicaoId: "ed1",
      });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1", janelaInicio: null, janelaFim: null });
      prisma.inscricao.update.mockResolvedValue({ id: "i1", fase1Inicio: new Date() });

      const result = await service.iniciarProva("u1");

      expect(prisma.inscricao.update).toHaveBeenCalledWith({
        where: { id: "i1" },
        data: { fase1Inicio: expect.any(Date) },
      });
      expect(result.message).toBe("Prova iniciada com sucesso");
    });

    it("retorna 'já em andamento' sem atualizar quando já iniciada", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", status: "CONFIRMADA", fase1Inicio: new Date(), fase1Fim: null, edicaoId: "ed1",
      });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1", janelaInicio: null, janelaFim: null });

      const result = await service.iniciarProva("u1");

      expect(prisma.inscricao.update).not.toHaveBeenCalled();
      expect(result.message).toBe("Prova já em andamento");
    });
  });

  describe("responder (remapa alternativa exibida → canônica)", () => {
    const base = {
      id: "i1",
      edicaoId: "ed1",
      fase1Inicio: new Date(),
      fase1Fim: null,
      fase1TempoExtraMinutos: 0,
    };

    it("marca correta=true quando a letra exibida mapeia para a correta", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(base);
      prisma.questao.findUnique.mockResolvedValue({ id: "q1", correta: "A" });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1", duracaoMinutos: 180, janelaFim: null });
      prisma.resposta.upsert.mockResolvedValue({ id: "r1" });

      const perm = permutacaoAlternativas("i1:q1");
      const letraExibida = "ABCDE"[perm.indexOf("A")];

      await service.responder("u1", { questaoId: "q1", alternativa: letraExibida } as any);

      expect(prisma.resposta.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ correta: true, alternativaMarcada: letraExibida }),
        }),
      );
    });

    it("marca correta=false para letra que não mapeia para a correta", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(base);
      prisma.questao.findUnique.mockResolvedValue({ id: "q1", correta: "A" });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1", duracaoMinutos: 180, janelaFim: null });
      prisma.resposta.upsert.mockResolvedValue({ id: "r1" });

      const perm = permutacaoAlternativas("i1:q1");
      const letraErrada = "ABCDE"[perm.indexOf("B")];

      await service.responder("u1", { questaoId: "q1", alternativa: letraErrada } as any);

      expect(prisma.resposta.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ correta: false, alternativaMarcada: letraErrada }),
        }),
      );
    });

    it("lança NotFoundException quando a inscrição não existe", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(null);
      await expect(
        service.responder("u1", { questaoId: "q1", alternativa: "A" } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("finalizarProva", () => {
    it("calcula a nota como corretas/total * 100", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", edicaoId: "ed1", fase1Fim: null, fase1Nota: null,
      });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1" });
      prisma.resposta.groupBy.mockResolvedValue([
        { correta: true, _count: { _all: 2 } },
        { correta: false, _count: { _all: 3 } },
      ]);
      prisma.provaQuestao.count.mockResolvedValue(10);
      prisma.inscricao.update.mockResolvedValue({ id: "i1", fase1Nota: 20 });

      const result = await service.finalizarProva("u1");

      // A nota é calculada e gravada, mas NÃO devolvida ao participante.
      expect(prisma.inscricao.update).toHaveBeenCalledWith({
        where: { id: "i1" },
        data: { fase1Nota: 20, fase1Fim: expect.any(Date), fase1FimMotivo: "ALUNO" },
      });
      expect(result).not.toHaveProperty("fase1Nota");
    });

    it("é idempotente quando a prova já foi finalizada", async () => {
      const finalizada = { id: "i1", fase1Nota: 20, fase1Fim: new Date() };
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", edicaoId: "ed1", fase1Fim: finalizada.fase1Fim, fase1Nota: 20,
      });
      prisma.inscricao.findUnique.mockResolvedValue(finalizada);

      const result = await service.finalizarProva("u1");

      expect(result).toEqual({ id: "i1", fase1Fim: finalizada.fase1Fim });
      expect(result).not.toHaveProperty("fase1Nota");
      expect(prisma.resposta.groupBy).not.toHaveBeenCalled();
      expect(prisma.inscricao.update).not.toHaveBeenCalled();
    });
  });

  describe("resumoProva", () => {
    it("não expõe nota, acertos nem percentual", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", edicaoId: "ed1", fase1Inicio: new Date(), fase1Fim: new Date(),
      });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1" });
      prisma.provaQuestao.count.mockResolvedValue(10);
      prisma.resposta.groupBy.mockResolvedValue([
        { correta: true, _count: { _all: 2 } },
        { correta: false, _count: { _all: 3 } },
      ]);

      const r = await service.resumoProva("u1");

      expect(r).toMatchObject({ inscricaoId: "i1", respondidas: 5, total: 10 });
      for (const campo of ["fase1Nota", "corretas", "percentual"]) {
        expect(r).not.toHaveProperty(campo);
      }
    });
  });
});
