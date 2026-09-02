import { jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";
import { ProvasService } from "./provas.service.js";

describe("ProvasService", () => {
  let service: ProvasService;
  let prisma: any;
  let auditoria: any;

  beforeEach(() => {
    prisma = {
      prova: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      provaQuestao: { count: jest.fn() },
    };
    auditoria = { log: jest.fn() };
    service = new ProvasService(prisma as any, auditoria as any);
  });

  describe("create", () => {
    it("cria a prova com status RASCUNHO", async () => {
      prisma.prova.create.mockResolvedValue({ id: "p1", status: "RASCUNHO" });

      await service.create("admin1", {
        edicaoId: "ed1",
        fase: 1,
        titulo: "Fase 1",
        duracaoMinutos: 180,
      } as any);

      expect(prisma.prova.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: "RASCUNHO", createdBy: "admin1" }),
        }),
      );
    });
  });

  describe("submeterRevisao", () => {
    it("lança erro quando não há questões", async () => {
      prisma.prova.findUnique.mockResolvedValue({ id: "p1", status: "RASCUNHO", questoes: [] });
      prisma.provaQuestao.count.mockResolvedValue(0);

      await expect(service.submeterRevisao("p1", "admin1")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("lança erro quando a prova não está em rascunho", async () => {
      prisma.prova.findUnique.mockResolvedValue({ id: "p1", status: "PUBLICADA", questoes: [] });

      await expect(service.submeterRevisao("p1", "admin1")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("move para EM_REVISAO quando há questões", async () => {
      prisma.prova.findUnique.mockResolvedValue({ id: "p1", status: "RASCUNHO", questoes: [] });
      prisma.provaQuestao.count.mockResolvedValue(2);
      prisma.prova.update.mockResolvedValue({ id: "p1", status: "EM_REVISAO" });

      await service.submeterRevisao("p1", "admin1");

      expect(prisma.prova.update).toHaveBeenCalledWith({
        where: { id: "p1" },
        data: { status: "EM_REVISAO" },
      });
    });
  });

  describe("publicar", () => {
    it("lança erro quando a prova já está em andamento", async () => {
      prisma.prova.findUnique.mockResolvedValue({ id: "p1", status: "EM_ANDAMENTO", questoes: [] });

      await expect(service.publicar("p1", "admin1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro quando não há questões", async () => {
      prisma.prova.findUnique.mockResolvedValue({ id: "p1", status: "RASCUNHO", questoes: [] });
      prisma.provaQuestao.count.mockResolvedValue(0);

      await expect(service.publicar("p1", "admin1")).rejects.toThrow(BadRequestException);
    });
  });
});
