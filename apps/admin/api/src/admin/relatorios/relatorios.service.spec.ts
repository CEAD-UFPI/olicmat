import { jest } from "@jest/globals";
import { NotFoundException } from "@nestjs/common";
import { RelatoriosService, formatarNumeroInscricao } from "./relatorios.service.js";
import {
  gerarPdfInscricoesConfirmadas,
  ordenarAlfabeticamente,
} from "./inscricoes-confirmadas.pdf.js";

describe("ordenarAlfabeticamente", () => {
  it("ordena em pt-BR ignorando acentos e caixa", () => {
    const r = ordenarAlfabeticamente([
      { nome: "Zélia", numero: "2026-0003" },
      { nome: "álvaro", numero: "2026-0002" },
      { nome: "Ana", numero: "2026-0001" },
      { nome: "Ângela", numero: "2026-0004" },
    ]);
    expect(r.map((l) => l.nome)).toEqual(["álvaro", "Ana", "Ângela", "Zélia"]);
  });

  it("desempata nomes iguais pelo número de inscrição", () => {
    const r = ordenarAlfabeticamente([
      { nome: "Maria", numero: "2026-0009" },
      { nome: "Maria", numero: "2026-0002" },
    ]);
    expect(r.map((l) => l.numero)).toEqual(["2026-0002", "2026-0009"]);
  });
});

describe("formatarNumeroInscricao", () => {
  it("prefixa o ano e preenche com zeros", () => {
    expect(formatarNumeroInscricao(2026, 7)).toBe("2026-0007");
    expect(formatarNumeroInscricao(2026, 12345)).toBe("2026-12345");
  });
});

describe("gerarPdfInscricoesConfirmadas", () => {
  const linhas = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      numero: `2026-${String(i + 1).padStart(4, "0")}`,
      nome: `Candidato ${i + 1} com nome bastante longo para quebrar linha na coluna`,
      curso: "Matemática — Licenciatura Plena",
      status: "Confirmada",
    }));

  it("gera um PDF válido e pagina listas longas", async () => {
    const buf = await gerarPdfInscricoesConfirmadas({
      titulo: "OLICMAT 2026",
      geradoEm: new Date(),
      linhas: linhas(120),
    });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
    const paginas = (buf.toString("latin1").match(/\/Type \/Page\b/g) ?? []).length;
    expect(paginas).toBeGreaterThan(1);
  });

  it("gera PDF mesmo sem inscrições", async () => {
    const buf = await gerarPdfInscricoesConfirmadas({
      titulo: "OLICMAT 2026",
      geradoEm: new Date(),
      linhas: [],
    });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});

describe("RelatoriosService.inscricoesConfirmadasPdf", () => {
  let prisma: any;
  let service: RelatoriosService;
  const edicao = { id: "ed1", ano: 2026, semestre: 1, titulo: "OLICMAT 2026" };

  beforeEach(() => {
    prisma = {
      edicao: { findUnique: jest.fn(), findFirst: jest.fn() },
      inscricao: { findMany: jest.fn() },
    };
    service = new RelatoriosService(prisma);
  });

  it("filtra apenas CONFIRMADA da edição ativa", async () => {
    prisma.edicao.findFirst.mockResolvedValueOnce(edicao);
    prisma.inscricao.findMany.mockResolvedValue([
      { numero: 2, user: { nome: "Bruno" }, curso: { nome: "Matemática" } },
      { numero: 1, user: { nome: "Ana" }, curso: null },
    ]);
    const r = await service.inscricoesConfirmadasPdf();
    expect(prisma.inscricao.findMany.mock.calls[0][0].where).toEqual({
      edicaoId: "ed1",
      status: "CONFIRMADA",
    });
    expect(prisma.edicao.findFirst.mock.calls[0][0].where).toEqual({ status: "ATIVA" });
    expect(r.filename).toBe("inscricoes-confirmadas-2026-1.pdf");
    expect(r.buffer.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("usa a edição informada", async () => {
    prisma.edicao.findUnique.mockResolvedValue(edicao);
    prisma.inscricao.findMany.mockResolvedValue([]);
    await service.inscricoesConfirmadasPdf("ed1");
    expect(prisma.edicao.findUnique).toHaveBeenCalledWith({ where: { id: "ed1" } });
  });

  it("lança NotFound quando não há edição", async () => {
    prisma.edicao.findFirst.mockResolvedValue(null);
    await expect(service.inscricoesConfirmadasPdf()).rejects.toThrow(NotFoundException);
  });
});
