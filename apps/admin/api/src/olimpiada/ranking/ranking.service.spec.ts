import { jest } from "@jest/globals";
import { RankingService } from "./ranking.service.js";

function inscricao(overrides: Record<string, unknown> = {}) {
  return {
    id: overrides.id ?? "i",
    estado: "PI",
    fase1Nota: 10,
    notaFinal: 10,
    user: { id: "u", nome: "Aluno", dataNascimento: new Date("2000-01-01") },
    avaliacoes: [],
    ...overrides,
  };
}

describe("RankingService", () => {
  let service: RankingService;
  let prisma: any;
  let auditoria: any;

  beforeEach(() => {
    prisma = {
      edicao: { findFirst: jest.fn(), findUnique: jest.fn() },
      inscricao: { findMany: jest.fn(), update: jest.fn() },
      rankingSnapshot: { findFirst: jest.fn(), create: jest.fn() },
      $transaction: jest.fn(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[])),
    };
    auditoria = { log: jest.fn() };
    service = new RankingService(prisma as any, auditoria as any);
  });

  describe("rankingPorEstado", () => {
    it("distribui medalhas por percentual (5% ouro, 10% prata, 15% bronze)", async () => {
      prisma.edicao.findFirst.mockResolvedValue({
        id: "ed1",
        pesoFase1: 0.5,
        pesoFase2: 0.5,
        desempate: [],
      });

      // 20 inscrições com notaFinal decrescente.
      const items = Array.from({ length: 20 }, (_, i) =>
        inscricao({ id: `i${i}`, notaFinal: 20 - i, fase1Nota: 20 - i }),
      );
      prisma.inscricao.findMany.mockResolvedValue(items);

      const result = await service.rankingPorEstado("PI");

      expect(result.OURO).toHaveLength(1);
      expect(result.PRATA).toHaveLength(2);
      expect(result.BRONZE).toHaveLength(3);
      expect(result.OURO[0].notaFinal).toBe(20);
      expect(result.OURO[0].medalha).toBe("OURO");
    });

    it("usa fase2Nota como primeiro critério de desempate", async () => {
      prisma.edicao.findFirst.mockResolvedValue({
        id: "ed1",
        pesoFase1: 0.5,
        pesoFase2: 0.5,
        desempate: [],
      });

      prisma.inscricao.findMany.mockResolvedValue([
        inscricao({ id: "a", notaFinal: 10, avaliacoes: [{ nota: 8 }] }),
        inscricao({ id: "b", notaFinal: 10, avaliacoes: [{ nota: 9 }] }),
      ]);

      const result = await service.rankingPorEstado("PI");

      expect(result.OURO[0].inscricaoId).toBe("b");
    });

    it("retorna vazio para estado sem inscritos", async () => {
      prisma.edicao.findFirst.mockResolvedValue({ id: "ed1" });
      prisma.inscricao.findMany.mockResolvedValue([]);

      const result = await service.rankingPorEstado("MA");

      expect(result).toEqual({ OURO: [], PRATA: [], BRONZE: [] });
    });
  });

  describe("rankingPublicado", () => {
    it("retorna objeto vazio quando não há snapshot publicado", async () => {
      prisma.edicao.findFirst.mockResolvedValue({ id: "ed1" });
      prisma.rankingSnapshot.findFirst.mockResolvedValue(null);

      const result = await service.rankingPublicado();

      expect(result).toEqual({});
    });
  });
});
