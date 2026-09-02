import { jest } from "@jest/globals";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ProvaService } from "./prova.service.js";
import { permutacaoAlternativas } from "./shuffle.js";

describe("ProvaService (exam-api)", () => {
  let service: ProvaService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      inscricao: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      questao: { findUnique: jest.fn() },
      prova: { findFirst: jest.fn() },
      provaQuestao: { findMany: jest.fn(), count: jest.fn() },
      resposta: { findMany: jest.fn(), groupBy: jest.fn(), upsert: jest.fn() },
    };
    service = new ProvaService(prisma as any);
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

      await service.finalizarProva("u1");

      expect(prisma.inscricao.update).toHaveBeenCalledWith({
        where: { id: "i1" },
        data: { fase1Nota: 20, fase1Fim: expect.any(Date) },
      });
    });

    it("é idempotente quando a prova já foi finalizada", async () => {
      const finalizada = { id: "i1", fase1Nota: 20, fase1Fim: new Date() };
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "i1", edicaoId: "ed1", fase1Fim: finalizada.fase1Fim, fase1Nota: 20,
      });
      prisma.inscricao.findUnique.mockResolvedValue(finalizada);

      const result = await service.finalizarProva("u1");

      expect(result).toEqual(finalizada);
      expect(prisma.resposta.groupBy).not.toHaveBeenCalled();
      expect(prisma.inscricao.update).not.toHaveBeenCalled();
    });
  });
});
