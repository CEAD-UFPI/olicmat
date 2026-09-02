import { jest } from "@jest/globals";
import { NotFoundException } from "@nestjs/common";
import { ProvaService } from "./prova.service.js";

describe("ProvaService", () => {
  let service: ProvaService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      inscricao: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      questao: { findUnique: jest.fn() },
      prova: { findFirst: jest.fn() },
      resposta: { upsert: jest.fn(), groupBy: jest.fn() },
      provaQuestao: { count: jest.fn() },
    };
    service = new ProvaService(prisma as any);
  });

  describe("responder", () => {
    const baseInscricao = { id: "insc1", edicaoId: "ed1", fase1Inicio: new Date() };

    beforeEach(() => {
      prisma.inscricao.findFirst.mockResolvedValue(baseInscricao);
      prisma.questao.findUnique.mockResolvedValue({ id: "q1", correta: "A" });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1" });
      prisma.resposta.upsert.mockResolvedValue({ id: "r1" });
    });

    it("marca correta=true quando a alternativa é a correta", async () => {
      await service.responder("user1", { questaoId: "q1", alternativa: "A" } as any);

      expect(prisma.resposta.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ correta: true, alternativaMarcada: "A" }),
        }),
      );
    });

    it("marca correta=false quando a alternativa é incorreta", async () => {
      await service.responder("user1", { questaoId: "q1", alternativa: "B" } as any);

      expect(prisma.resposta.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ correta: false, alternativaMarcada: "B" }),
        }),
      );
    });

    it("lança NotFoundException quando a inscrição não existe", async () => {
      prisma.inscricao.findFirst.mockResolvedValue(null);

      await expect(
        service.responder("user1", { questaoId: "q1", alternativa: "A" } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("finalizarProva", () => {
    it("calcula a nota como corretas/total * 100", async () => {
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "insc1",
        edicaoId: "ed1",
        fase1Fim: null,
        fase1Nota: null,
      });
      prisma.prova.findFirst.mockResolvedValue({ id: "p1" });
      prisma.resposta.groupBy.mockResolvedValue([
        { correta: true, _count: { _all: 2 } },
        { correta: false, _count: { _all: 3 } },
      ]);
      prisma.provaQuestao.count.mockResolvedValue(10);
      prisma.inscricao.update.mockResolvedValue({ id: "insc1", fase1Nota: 20 });

      await service.finalizarProva("user1");

      expect(prisma.inscricao.update).toHaveBeenCalledWith({
        where: { id: "insc1" },
        data: { fase1Nota: 20, fase1Fim: expect.any(Date) },
      });
    });

    it("é idempotente quando a prova já foi finalizada", async () => {
      const jaFinalizada = { id: "insc1", fase1Nota: 20, fase1Fim: new Date() };
      prisma.inscricao.findFirst.mockResolvedValue({
        id: "insc1",
        edicaoId: "ed1",
        fase1Fim: jaFinalizada.fase1Fim,
        fase1Nota: 20,
      });
      prisma.inscricao.findUnique.mockResolvedValue(jaFinalizada);

      const result = await service.finalizarProva("user1");

      expect(result).toEqual(jaFinalizada);
      expect(prisma.resposta.groupBy).not.toHaveBeenCalled();
      expect(prisma.inscricao.update).not.toHaveBeenCalled();
    });
  });
});
