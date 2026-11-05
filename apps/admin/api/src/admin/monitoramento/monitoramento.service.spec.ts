import { jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";
import { MonitoramentoService } from "./monitoramento.service.js";

describe("MonitoramentoService — janela de prova", () => {
  let service: MonitoramentoService;
  let prisma: any;
  let auditoria: any;

  const janelaAberta = {
    janelaInicio: new Date(Date.now() - 3600_000),
    janelaFim: new Date(Date.now() + 3600_000),
  };

  const inscricaoBase = {
    id: "insc1",
    userId: "user1",
    edicaoId: "ed1",
    fase1Inicio: new Date(),
    fase1Fim: null,
    fase1TempoExtraMinutos: 10,
  };

  beforeEach(() => {
    prisma = {
      inscricao: { findUnique: jest.fn(), update: jest.fn() },
      prova: { findFirst: jest.fn() },
    };
    auditoria = { log: jest.fn() };
    service = new MonitoramentoService(prisma as any, auditoria as any);
  });

  it("resetarTempo funciona dentro da janela", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue(janelaAberta);
    prisma.inscricao.update.mockResolvedValue({
      fase1Inicio: new Date(),
      fase1TempoExtraMinutos: 0,
    });

    const result = await service.resetarTempo("insc1", "admin1");

    expect(result.message).toContain("resetado");
    expect(auditoria.log).toHaveBeenCalledWith(
      "admin1",
      "RESETAR_TEMPO_PROVA",
      "Inscricao",
      "insc1",
      expect.any(Object),
    );
  });

  it("resetarTempo lança BadRequest sem prova de fase 1", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue(null);

    await expect(service.resetarTempo("insc1", "admin1")).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.inscricao.update).not.toHaveBeenCalled();
  });

  it("resetarTempo lança BadRequest com janela sem datas", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue({
      janelaInicio: null,
      janelaFim: null,
    });

    await expect(service.resetarTempo("insc1", "admin1")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("resetarTempo lança BadRequest fora da janela (passada)", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue({
      janelaInicio: new Date(Date.now() - 2 * 3600_000),
      janelaFim: new Date(Date.now() - 3 * 3600_000),
    });

    await expect(service.resetarTempo("insc1", "admin1")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("adicionarTempo soma minutos dentro da janela", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue(janelaAberta);
    prisma.inscricao.update.mockResolvedValue({
      fase1TempoExtraMinutos: 20,
    });

    const result = await service.adicionarTempo("insc1", 10, "admin1");

    expect(result.tempoExtraTotal).toBe(20);
    expect(prisma.inscricao.update).toHaveBeenCalledWith({
      where: { id: "insc1" },
      data: { fase1TempoExtraMinutos: 20 },
    });
    expect(auditoria.log).toHaveBeenCalledWith(
      "admin1",
      "ADICIONAR_TEMPO_PROVA",
      "Inscricao",
      "insc1",
      expect.any(Object),
    );
  });

  it("adicionarTempo funciona até 2h depois do fechamento da janela", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue({
      janelaInicio: new Date(Date.now() - 4 * 3600_000),
      janelaFim: new Date(Date.now() - 3600_000),
    });
    prisma.inscricao.update.mockResolvedValue({ fase1TempoExtraMinutos: 20 });

    await expect(service.adicionarTempo("insc1", 10, "admin1")).resolves.toBeDefined();
  });

  it("reabrir com adicionarTempo mantém o início e soma ao tempo extra", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({ ...inscricaoBase, fase1Fim: new Date() });
    prisma.prova.findFirst.mockResolvedValue(janelaAberta);
    prisma.inscricao.update.mockResolvedValue({ fase1TempoExtraMinutos: 25 });

    await service.adicionarTempo("insc1", 15, "admin1");

    const { data } = prisma.inscricao.update.mock.calls[0][0];
    expect(data).toEqual({
      fase1Fim: null,
      fase1Nota: null,
      fase1FimMotivo: null,
      fase1TempoExtraMinutos: 25,
    });
    expect(data.fase1Inicio).toBeUndefined();
  });

  describe("destravar", () => {
    const provaDuasHoras = { ...janelaAberta, duracaoMinutos: 120 };
    const encerrada = {
      ...inscricaoBase,
      fase1Inicio: new Date(Date.now() - 30 * 60_000),
      fase1Fim: new Date(),
      fase1Nota: 40,
      fase1FimMotivo: "ADVERTENCIAS",
      fase1Advertencias: 3,
      fase1TempoExtraMinutos: 0,
    };

    it("devolve à prova, zera advertências e guarda a justificativa", async () => {
      prisma.inscricao.findUnique.mockResolvedValue(encerrada);
      prisma.prova.findFirst.mockResolvedValue(provaDuasHoras);

      await service.destravar("insc1", 5, "Queda de energia comprovada", "admin1");

      expect(prisma.inscricao.update).toHaveBeenCalledWith({
        where: { id: "insc1" },
        data: {
          fase1Fim: null,
          fase1Nota: null,
          fase1FimMotivo: null,
          fase1Advertencias: 0,
          fase1TempoExtraMinutos: 5,
        },
      });
      expect(auditoria.log).toHaveBeenCalledWith(
        "admin1",
        "DESTRAVAR_PROVA",
        "Inscricao",
        "insc1",
        expect.objectContaining({ justificativa: "Queda de energia comprovada" }),
      );
    });

    it("recusa quando os minutos não bastam para haver tempo de prova", async () => {
      prisma.inscricao.findUnique.mockResolvedValue({
        ...encerrada,
        fase1Inicio: new Date(Date.now() - 3 * 3600_000),
      });
      prisma.prova.findFirst.mockResolvedValue(provaDuasHoras);

      await expect(service.destravar("insc1", 5, "Motivo válido", "admin1")).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.inscricao.update).not.toHaveBeenCalled();
    });
  });

  it("senhaTemporaria não grava a senha na auditoria", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({ userId: "user1", user: { role: "ALUNO" } });
    prisma.user = { update: jest.fn() };

    const { senha } = await service.senhaTemporaria("insc1", "admin1");

    expect(senha).toMatch(/^[A-Z2-9]{10}$/);
    expect(JSON.stringify(auditoria.log.mock.calls)).not.toContain(senha);
  });

  it("senhaTemporaria recusa quem não é participante", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({ userId: "user1", user: { role: "ADMIN" } });

    await expect(service.senhaTemporaria("insc1", "admin1")).rejects.toThrow(BadRequestException);
  });

  it("adicionarTempo lança BadRequest fora da janela", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue({
      janelaInicio: new Date(Date.now() - 5 * 3600_000),
      janelaFim: new Date(Date.now() - 3 * 3600_000),
    });

    await expect(service.adicionarTempo("insc1", 10, "admin1")).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.inscricao.update).not.toHaveBeenCalled();
  });
});
