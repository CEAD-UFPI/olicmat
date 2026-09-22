import { jest } from "@jest/globals";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
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

describe("LinksConviteService — admin", () => {
  let service: LinksConviteService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      linkConvite: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      curso: { findUnique: jest.fn() },
      user: { count: jest.fn() },
    };
    service = new LinksConviteService(prisma as any);
  });

  describe("criarLinkAdmin", () => {
    it("cria um link para COORDENADOR_CURSO derivando instituicaoId do curso", async () => {
      prisma.curso.findUnique.mockResolvedValue({ instituicaoId: "inst1" });
      prisma.linkConvite.create.mockResolvedValue({ id: "l1", token: "tok" });

      await service.criarLinkAdmin(
        { role: "COORDENADOR_CURSO", cursoId: "curso1" },
        { id: "admin1" },
      );

      expect(prisma.linkConvite.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          role: "COORDENADOR_CURSO",
          cursoId: "curso1",
          instituicaoId: "inst1",
          criadoPorId: "admin1",
        },
      });
    });

    it("cria um link para AVALIADOR sem curso nem instituição", async () => {
      prisma.linkConvite.create.mockResolvedValue({ id: "l1", token: "tok" });

      await service.criarLinkAdmin({ role: "AVALIADOR" }, { id: "admin1" });

      expect(prisma.curso.findUnique).not.toHaveBeenCalled();
      expect(prisma.linkConvite.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          role: "AVALIADOR",
          cursoId: null,
          instituicaoId: null,
          criadoPorId: "admin1",
        },
      });
    });

    it("lança BadRequestException quando o curso não existe", async () => {
      prisma.curso.findUnique.mockResolvedValue(null);

      await expect(
        service.criarLinkAdmin(
          { role: "COORDENADOR_CURSO", cursoId: "curso-inexistente" },
          { id: "admin1" },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("regenerarLinkAdmin", () => {
    it("lança NotFoundException quando o link não existe", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue(null);

      await expect(service.regenerarLinkAdmin("l1")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("regenera o token do link", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({ id: "l1", token: "velho" });
      prisma.linkConvite.update.mockResolvedValue({ id: "l1", token: "novo" });

      const resultado = await service.regenerarLinkAdmin("l1");

      expect(prisma.linkConvite.update).toHaveBeenCalledWith({
        where: { id: "l1" },
        data: { token: expect.any(String) },
      });
      expect(resultado.token).toBe("novo");
    });
  });

  describe("listarLinksAdmin", () => {
    it("pagina os links e acrescenta o contador de cadastros por link", async () => {
      prisma.linkConvite.findMany.mockResolvedValue([
        { id: "l1", role: "AVALIADOR" },
        { id: "l2", role: "COMISSAO" },
      ]);
      prisma.linkConvite.count.mockResolvedValue(2);
      prisma.user.count.mockResolvedValueOnce(3).mockResolvedValueOnce(0);

      const resultado = await service.listarLinksAdmin({});

      expect(resultado.data).toEqual([
        { id: "l1", role: "AVALIADOR", totalCadastros: 3 },
        { id: "l2", role: "COMISSAO", totalCadastros: 0 },
      ]);
      expect(resultado.total).toBe(2);
    });
  });
});
