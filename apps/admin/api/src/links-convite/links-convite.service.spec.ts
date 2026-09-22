import { jest } from "@jest/globals";
import { ForbiddenException } from "@nestjs/common";
import { LinksConviteService } from "./links-convite.service.js";

describe("LinksConviteService — coordenador", () => {
  let service: LinksConviteService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      coordenadorCurso: { findUnique: jest.fn() },
      linkConvite: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
      user: { count: jest.fn() },
    };
    service = new LinksConviteService(prisma as any);
  });

  describe("obterLinkCoordenador", () => {
    it("retorna token null quando o coordenador nunca gerou um link", async () => {
      prisma.linkConvite.findFirst.mockResolvedValue(null);

      const resultado = await service.obterLinkCoordenador("coord1");

      expect(resultado).toEqual({ token: null, totalCadastros: 0 });
    });

    it("retorna token e contador quando já existe", async () => {
      prisma.linkConvite.findFirst.mockResolvedValue({ id: "l1", token: "abc123" });
      prisma.user.count.mockResolvedValue(5);

      const resultado = await service.obterLinkCoordenador("coord1");

      expect(resultado).toEqual({ token: "abc123", totalCadastros: 5 });
      expect(prisma.user.count).toHaveBeenCalledWith({ where: { origemLinkId: "l1" } });
    });
  });

  describe("gerarOuRegenerarLinkCoordenador", () => {
    it("lança ForbiddenException quando o coordenador não tem curso vinculado", async () => {
      prisma.coordenadorCurso.findUnique.mockResolvedValue(null);

      await expect(
        service.gerarOuRegenerarLinkCoordenador("coord1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("cria um novo link quando o coordenador nunca gerou um", async () => {
      prisma.coordenadorCurso.findUnique.mockResolvedValue({
        curso: { id: "curso1", instituicaoId: "inst1" },
      });
      prisma.linkConvite.findFirst.mockResolvedValue(null);
      prisma.linkConvite.create.mockResolvedValue({ id: "l1", token: "novo-token" });

      const resultado = await service.gerarOuRegenerarLinkCoordenador("coord1");

      expect(prisma.linkConvite.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          role: "ALUNO",
          cursoId: "curso1",
          instituicaoId: "inst1",
          criadoPorId: "coord1",
        },
      });
      expect(prisma.linkConvite.update).not.toHaveBeenCalled();
      expect(resultado.token).toBe("novo-token");
    });

    it("regenera o token do link existente em vez de criar outro", async () => {
      prisma.coordenadorCurso.findUnique.mockResolvedValue({
        curso: { id: "curso1", instituicaoId: "inst1" },
      });
      prisma.linkConvite.findFirst.mockResolvedValue({ id: "l1", token: "velho" });
      prisma.linkConvite.update.mockResolvedValue({ id: "l1", token: "novo" });

      const resultado = await service.gerarOuRegenerarLinkCoordenador("coord1");

      expect(prisma.linkConvite.create).not.toHaveBeenCalled();
      expect(prisma.linkConvite.update).toHaveBeenCalledWith({
        where: { id: "l1" },
        data: { token: expect.any(String) },
      });
      expect(resultado.token).toBe("novo");
    });
  });
});
