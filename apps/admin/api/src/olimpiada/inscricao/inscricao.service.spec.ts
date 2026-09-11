import { jest } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { BadRequestException, ConflictException, ForbiddenException } from "@nestjs/common";
import { InscricaoService } from "./inscricao.service.js";
import { PrismaService } from "../../prisma.service.js";
import { AuditoriaService } from "../../admin/auditoria/auditoria.service.js";
import { EmailService } from "../../email/email.service.js";
import { NotificacoesService } from "../../notificacoes/notificacoes.service.js";

describe("InscricaoService", () => {
  let service: InscricaoService;
  let prisma: any;
  let auditoria: any;
  let email: any;
  let notificacoes: any;

  beforeEach(() => {
    prisma = {
      edicao: { findMany: jest.fn() },
      inscricao: { findUnique: jest.fn(), create: jest.fn() },
      instituicao: { upsert: jest.fn() },
      curso: { upsert: jest.fn() },
      user: { findUnique: jest.fn() },
    };
    auditoria = { log: jest.fn() };
    email = { enviarStatusInscricao: jest.fn() };
    notificacoes = { criar: jest.fn() };
    service = new InscricaoService(prisma as any, auditoria as any, email as any, notificacoes as any);
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

    it("usa o vínculo do convidado sem exigir instituição/curso no payload", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
      ]);
      prisma.inscricao.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue({
        instituicaoId: "inst-vinculo",
        cursoId: "curso-vinculo",
        curso: { instituicaoId: "inst-vinculo" },
      });
      prisma.inscricao.create.mockResolvedValue({ id: "insc1" });

      await service.criar("user1", {
        estado: "PI",
        municipio: "Teresina",
      } as any);

      expect(prisma.instituicao.upsert).not.toHaveBeenCalled();
      expect(prisma.curso.upsert).not.toHaveBeenCalled();
      expect(prisma.inscricao.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            instituicaoId: "inst-vinculo",
            cursoId: "curso-vinculo",
          }),
        }),
      );
    });

    it("exige instituição/curso quando não há vínculo nem dados no payload", async () => {
      prisma.edicao.findMany.mockResolvedValue([
        { id: "ed1", ano: 2026, semestre: 1 },
      ]);
      prisma.inscricao.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.criar("user1", {
          estado: "PI",
          municipio: "Teresina",
        } as any),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.inscricao.create).not.toHaveBeenCalled();
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

describe("InscricaoService — histórico e regra terminal", () => {
  let service: InscricaoService;
  let prisma: {
    inscricao: { findUnique: jest.Mock; update: jest.Mock };
    inscricaoHistorico: { create: jest.Mock };
    edicao: { findUnique: jest.Mock };
  };
  let auditoria: { log: jest.Mock };
  let email: { enviarStatusInscricao: jest.Mock };
  let notificacoes: { criar: jest.Mock };

  beforeEach(async () => {
    prisma = {
      inscricao: { findUnique: jest.fn(), update: jest.fn() },
      inscricaoHistorico: { create: jest.fn() },
      edicao: { findUnique: jest.fn() },
    };
    auditoria = { log: jest.fn() };
    email = { enviarStatusInscricao: jest.fn() };
    notificacoes = { criar: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        InscricaoService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditoriaService, useValue: auditoria },
        { provide: EmailService, useValue: email },
        { provide: NotificacoesService, useValue: notificacoes },
      ],
    }).compile();

    service = moduleRef.get(InscricaoService);
  });

  it("rejeita alteração de status quando a inscrição já está CONFIRMADA", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({
      id: "insc-1",
      cursoId: "curso-1",
      status: "CONFIRMADA",
      user: { id: "user-1", email: "a@a.com", nome: "Ana" },
    });

    await expect(
      service.atualizarStatus("insc-1", "REJEITADA", { id: "actor-1", role: "ADMIN" }, "motivo qualquer"),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.inscricao.update).not.toHaveBeenCalled();
  });

  it("exige justificativa ao rejeitar", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({
      id: "insc-1",
      cursoId: "curso-1",
      status: "PENDENTE",
      user: { id: "user-1", email: "a@a.com", nome: "Ana" },
    });

    await expect(
      service.atualizarStatus("insc-1", "REJEITADA", { id: "actor-1", role: "ADMIN" }, undefined),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("grava histórico e envia email/notificação ao rejeitar com justificativa", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({
      id: "insc-1",
      cursoId: "curso-1",
      status: "PENDENTE",
      user: { id: "user-1", email: "a@a.com", nome: "Ana" },
    });
    prisma.inscricao.update.mockResolvedValue({ id: "insc-1", status: "REJEITADA" });

    await service.atualizarStatus("insc-1", "REJEITADA", { id: "actor-1", role: "ADMIN" }, "Comprovante ilegível");

    expect(prisma.inscricaoHistorico.create).toHaveBeenCalledWith({
      data: {
        inscricaoId: "insc-1",
        statusAnterior: "PENDENTE",
        statusNovo: "REJEITADA",
        justificativa: "Comprovante ilegível",
        actorId: "actor-1",
      },
    });
    expect(email.enviarStatusInscricao).toHaveBeenCalledWith(
      "a@a.com",
      "Ana",
      "REJEITADA",
      "Comprovante ilegível",
    );
    expect(notificacoes.criar).toHaveBeenCalledWith(
      "user-1",
      expect.any(String),
      expect.any(String),
      "/competidor/inscricao",
    );
  });

  it("coordenador confirma inscrição de aluno que ele próprio convidou", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({
      id: "insc-1",
      cursoId: "curso-1",
      status: "PENDENTE",
      user: { id: "user-1", email: "a@a.com", nome: "Ana", coordenadorId: "coord-1" },
    });
    prisma.inscricao.update.mockResolvedValue({ id: "insc-1", status: "CONFIRMADA" });

    await service.confirmar("insc-1", { id: "coord-1", role: "COORDENADOR_CURSO" });

    expect(prisma.inscricao.update).toHaveBeenCalledWith({
      where: { id: "insc-1" },
      data: { status: "CONFIRMADA" },
    });
  });

  it("coordenador não gerencia inscrição de aluno convidado por outro coordenador", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({
      id: "insc-1",
      cursoId: "curso-1",
      status: "PENDENTE",
      user: { id: "user-1", email: "a@a.com", nome: "Ana", coordenadorId: "coord-outro" },
    });

    await expect(
      service.atualizarStatus(
        "insc-1",
        "REJEITADA",
        { id: "coord-1", role: "COORDENADOR_CURSO" },
        "Motivo da rejeição",
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.inscricao.update).not.toHaveBeenCalled();
  });

  it("coordenador não gerencia inscrição de aluno auto-cadastrado (coordenadorId null)", async () => {
    prisma.inscricao.findUnique.mockResolvedValue({
      id: "insc-1",
      cursoId: "curso-1",
      status: "PENDENTE",
      user: { id: "user-1", email: "a@a.com", nome: "Ana", coordenadorId: null },
    });

    await expect(
      service.atualizarStatus(
        "insc-1",
        "REJEITADA",
        { id: "coord-1", role: "COORDENADOR_CURSO" },
        "Motivo da rejeição",
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.inscricao.update).not.toHaveBeenCalled();
  });
});
