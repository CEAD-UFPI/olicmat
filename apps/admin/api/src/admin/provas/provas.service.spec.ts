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

  describe("encerrar", () => {
    it("recusa durante a realização", async () => {
      prisma.prova.findUnique.mockResolvedValue({
        id: "p1", status: "PUBLICADA", questoes: [],
        janelaInicio: new Date(Date.now() - 60_000), janelaFim: new Date(Date.now() + 60_000),
      });

      await expect(service.encerrar("p1", "admin1")).rejects.toThrow(/durante a realização/);
      expect(prisma.prova.update).not.toHaveBeenCalled();
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

    describe("Fase 1", () => {
      const dia = (hora: string) => new Date(`2026-11-08T${hora}:00-03:00`);
      const prova = {
        id: "p1", status: "RASCUNHO", fase: 1, edicaoId: "e1", questoes: [],
        janelaInicio: dia("08:30"), limiteInicio: dia("09:00"), janelaFim: dia("11:30"),
      };

      beforeEach(() => {
        prisma.provaQuestao.count.mockResolvedValue(20);
        prisma.prova.findFirst = jest.fn(async () => null);
        prisma.prova.update.mockResolvedValue({ id: "p1", status: "PUBLICADA" });
      });

      it("recusa sem horários definidos", async () => {
        prisma.prova.findUnique.mockResolvedValue({ ...prova, limiteInicio: null });

        await expect(service.publicar("p1", "admin1")).rejects.toThrow(/limite para iniciar/);
        expect(prisma.prova.update).not.toHaveBeenCalled();
      });

      it("recusa limite fora da janela", async () => {
        prisma.prova.findUnique.mockResolvedValue({ ...prova, limiteInicio: dia("12:00") });

        await expect(service.publicar("p1", "admin1")).rejects.toThrow(/entre o início e o fim/);
      });

      it("recusa segunda prova de Fase 1 publicada na edição", async () => {
        prisma.prova.findUnique.mockResolvedValue(prova);
        prisma.prova.findFirst = jest.fn(async () => ({ titulo: "Outra" }));

        await expect(service.publicar("p1", "admin1")).rejects.toThrow(/já tem uma prova/);
      });

      it("publica com os horários corretos", async () => {
        prisma.prova.findUnique.mockResolvedValue(prova);

        await service.publicar("p1", "admin1");

        expect(prisma.prova.update).toHaveBeenCalledWith(
          expect.objectContaining({ data: expect.objectContaining({ status: "PUBLICADA" }) }),
        );
      });
    });
  });
});
