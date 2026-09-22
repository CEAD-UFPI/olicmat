import { jest } from "@jest/globals";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { LinksConviteService } from "./links-convite.service.js";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: { hash: jest.fn(async () => "hashed") },
}));

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

describe("LinksConviteService — público", () => {
  let service: LinksConviteService;
  let prisma: any;

  const dadosBase = {
    nome: "Fulano de Tal",
    email: "fulano@example.com",
    cpf: "11144477735",
    senha: "senha1234",
    dataNascimento: "2000-01-01",
    telefone: undefined,
    nomeMae: undefined,
    matricula: undefined,
  };

  beforeEach(() => {
    prisma = {
      linkConvite: { findUnique: jest.fn() },
      user: { findUnique: jest.fn(), create: jest.fn() },
      coordenadorCurso: { create: jest.fn() },
      $transaction: jest.fn(async (fn: any) => fn(prisma)),
    };
    service = new LinksConviteService(prisma as any);
  });

  describe("buscarPorToken", () => {
    it("lança NotFoundException quando o token não existe", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue(null);

      await expect(service.buscarPorToken("tok")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("retorna papel, curso e instituição do link", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        role: "ALUNO",
        curso: {
          id: "c1",
          nome: "Matemática",
          instituicao: { id: "i1", nome: "UFPI", sigla: "UFPI" },
        },
        instituicao: null,
      });

      const resultado = await service.buscarPorToken("tok");

      expect(resultado).toEqual({
        role: "ALUNO",
        curso: {
          id: "c1",
          nome: "Matemática",
          instituicao: { id: "i1", nome: "UFPI", sigla: "UFPI" },
        },
        instituicao: null,
      });
    });
  });

  describe("cadastrar", () => {
    it("lança NotFoundException quando o token não existe", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue(null);

      await expect(service.cadastrar("tok", dadosBase as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("lança BadRequestException quando o e-mail já está em uso", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "ALUNO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "coord1",
      });
      prisma.user.findUnique.mockResolvedValueOnce({ id: "u-existente" });

      await expect(service.cadastrar("tok", dadosBase as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("lança BadRequestException quando o CPF já está em uso", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "ALUNO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "coord1",
      });
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "u-existente" });

      await expect(service.cadastrar("tok", dadosBase as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("cria o usuário herdando papel/curso/instituição do link e o vínculo de coordenador quando ALUNO", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "ALUNO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "coord1",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "novo",
        nome: dadosBase.nome,
        email: dadosBase.email,
        role: "ALUNO",
      });

      const resultado = await service.cadastrar("tok", dadosBase as any);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: "ALUNO",
            instituicaoId: "i1",
            cursoId: "c1",
            coordenadorId: "coord1",
            origemLinkId: "l1",
          }),
        }),
      );
      expect(prisma.coordenadorCurso.create).not.toHaveBeenCalled();
      expect(resultado.id).toBe("novo");
    });

    it("cria o vínculo CoordenadorCurso quando o link é de papel COORDENADOR_CURSO", async () => {
      prisma.linkConvite.findUnique.mockResolvedValue({
        id: "l1",
        role: "COORDENADOR_CURSO",
        cursoId: "c1",
        instituicaoId: "i1",
        criadoPorId: "admin1",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "novoCoord",
        nome: dadosBase.nome,
        email: dadosBase.email,
        role: "COORDENADOR_CURSO",
      });

      const resultado = await service.cadastrar("tok", dadosBase as any);

      expect(prisma.coordenadorCurso.create).toHaveBeenCalledWith({
        data: { userId: "novoCoord", cursoId: "c1" },
      });
      expect(resultado.id).toBe("novoCoord");
    });
  });
});
