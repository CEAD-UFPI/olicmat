import { jest } from "@jest/globals";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { InscricaoService } from "./inscricao.service.js";

describe("InscricaoService", () => {
  let service: InscricaoService;
  let prisma: any;
  let auditoria: any;

  beforeEach(() => {
    prisma = {
      edicao: { findMany: jest.fn() },
      inscricao: { findUnique: jest.fn(), create: jest.fn() },
      instituicao: { upsert: jest.fn() },
      curso: { upsert: jest.fn() },
    };
    auditoria = { log: jest.fn() };
    service = new InscricaoService(prisma as any, auditoria as any);
  });

  describe("criar", () => {
    it("lança erro quando não há edição aberta", async () => {
      prisma.edicao.findMany.mockResolvedValue([]);

      await expect(
        service.criar("user1", {
          estado: "PI",
          instituicao: "UFPI",
          curso: "Matemática",
        } as any),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.inscricao.create).not.toHaveBeenCalled();
    });

    it("inscreve automaticamente quando há uma única edição aberta", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
      ]);
      prisma.inscricao.findUnique.mockResolvedValue(null);
      prisma.instituicao.upsert.mockResolvedValue({ id: "inst1" });
      prisma.curso.upsert.mockResolvedValue({ id: "curso1" });
      prisma.inscricao.create.mockResolvedValue({ id: "insc1" });

      await service.criar("user1", {
        estado: "PI",
        instituicao: "UFPI",
        curso: "Matemática",
      } as any);

      expect(prisma.inscricao.create.mock.calls[0][0].data.edicaoId).toBe("ed1");
      expect(prisma.inscricao.create.mock.calls[0][0].data.userId).toBe("user1");
    });

    it("exige edicaoId quando há mais de uma edição aberta", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
        { id: "ed2", ano: 2026, semestre: 2 },
      ]);

      await expect(
        service.criar("user1", {
          estado: "PI",
          instituicao: "UFPI",
          curso: "Matemática",
        } as any),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.inscricao.create).not.toHaveBeenCalled();
    });

    it("valida edicaoId informado contra as edições abertas", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
      ]);

      await expect(
        service.criar("user1", {
          estado: "PI",
          instituicao: "UFPI",
          curso: "Matemática",
          edicaoId: "ed-fechada",
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it("usa edicaoId informado quando válido", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
        { id: "ed2", ano: 2026, semestre: 2 },
      ]);
      prisma.inscricao.findUnique.mockResolvedValue(null);
      prisma.instituicao.upsert.mockResolvedValue({ id: "inst1" });
      prisma.curso.upsert.mockResolvedValue({ id: "curso1" });
      prisma.inscricao.create.mockResolvedValue({ id: "insc1" });

      await service.criar("user1", {
        estado: "PI",
        instituicao: "UFPI",
        curso: "Matemática",
        edicaoId: "ed2",
      } as any);

      expect(prisma.inscricao.create.mock.calls[0][0].data.edicaoId).toBe("ed2");
    });

    it("lança ConflictException se já inscrito na edição", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
      ]);
      prisma.inscricao.findUnique.mockResolvedValue({ id: "insc-existente" });

      await expect(
        service.criar("user1", {
          estado: "PI",
          instituicao: "UFPI",
          curso: "Matemática",
        } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("listarEdicoesAbertas", () => {
    it("retorna edições abertas com shape enxuto", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1, titulo: "OLICMAT 2026.1" },
      ]);

      const result = await service.listarEdicoesAbertas();

      expect(result).toEqual([
        { id: "ed1", ano: 2026, semestre: 1, titulo: "OLICMAT 2026.1" },
      ]);
    });
  });
});
