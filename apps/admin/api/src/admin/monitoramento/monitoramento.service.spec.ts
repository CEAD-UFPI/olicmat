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
      janelaFim: new Date(Date.now() - 3600_000),
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

  it("adicionarTempo lança BadRequest fora da janela", async () => {
    prisma.inscricao.findUnique.mockResolvedValue(inscricaoBase);
    prisma.prova.findFirst.mockResolvedValue({
      janelaInicio: new Date(Date.now() - 2 * 3600_000),
      janelaFim: new Date(Date.now() - 3600_000),
    });

    await expect(service.adicionarTempo("insc1", 10, "admin1")).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.inscricao.update).not.toHaveBeenCalled();
  });
});
