import { jest } from "@jest/globals";
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";

jest.mock("bcrypt", () => ({
  hash: jest.fn(async () => "hashed"),
  compare: jest.fn(async () => true),
}));

import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;
  let auditoria: any;
  let email: any;

  beforeEach(() => {
    prisma = {
      user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      token: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      instituicao: { upsert: jest.fn() },
      curso: { upsert: jest.fn() },
      inscricao: { findFirst: jest.fn() },
      $transaction: jest.fn(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[])),
    };
    jwt = { sign: jest.fn(() => "jwt-token") };
    auditoria = { log: jest.fn() };
    email = { enviarConfirmacaoEmail: jest.fn(), enviarRecuperacaoSenha: jest.fn() };
    service = new AuthService(prisma as any, jwt as any, auditoria as any, email as any);

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  describe("login", () => {
    it("lança UnauthorizedException quando o usuário não existe", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: "x@x.com", senha: "123" } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("lança UnauthorizedException quando a senha é inválida", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "u1", senhaHash: "h" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: "x@x.com", senha: "errada" } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("retorna usuário e accessToken no login bem-sucedido", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "u1",
        nome: "Ana",
        email: "ana@x.com",
        senhaHash: "h",
        role: "ALUNO",
        emailConfirmado: true,
      });

      const result = await service.login({ email: "ana@x.com", senha: "123" } as any);

      expect(jwt.sign).toHaveBeenCalledWith({
        sub: "u1",
        email: "ana@x.com",
        role: "ALUNO",
      });
      expect(result.accessToken).toBe("jwt-token");
      expect(result.user.email).toBe("ana@x.com");
    });
  });

  describe("register", () => {
    const dto = {
      nome: "Ana",
      email: "ana@x.com",
      cpf: "12345678900",
      matricula: "2020",
      dataNascimento: "2000-01-01",
      senha: "123456",
    };

    it("lança ConflictException se email ou CPF já existe", async () => {
      prisma.user.findFirst.mockResolvedValue({ id: "existing" });

      await expect(service.register(dto as any)).rejects.toThrow(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("cria o usuário e gera token de confirmação", async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "u1",
        nome: "Ana",
        email: "ana@x.com",
        role: "ALUNO",
        emailConfirmado: false,
        createdAt: new Date(),
      });
      prisma.token.create.mockResolvedValue({ id: "t1" });

      const result = await service.register(dto as any);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: "ana@x.com", senhaHash: "hashed" }),
        }),
      );
      expect(prisma.token.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tipo: "EMAIL_CONFIRM" }),
        }),
      );
      expect(email.enviarConfirmacaoEmail).toHaveBeenCalled();
      expect(result.accessToken).toBe("jwt-token");
    });
  });

  describe("esqueciSenha", () => {
    it("não revela se o email existe", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.esqueciSenha("nada@x.com");

      expect(result.message).toContain("Se o email existir");
      expect(prisma.token.create).not.toHaveBeenCalled();
    });

    it("gera token de recuperação quando o usuário existe", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "ana@x.com", nome: "Ana" });
      prisma.token.create.mockResolvedValue({ id: "t1" });

      await service.esqueciSenha("ana@x.com");

      expect(prisma.token.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tipo: "PASSWORD_RESET" }),
        }),
      );
      expect(email.enviarRecuperacaoSenha).toHaveBeenCalled();
    });
  });

  describe("redefinirSenha", () => {
    it("lança BadRequestException para token inválido", async () => {
      prisma.token.findUnique.mockResolvedValue(null);

      await expect(service.redefinirSenha("bad", "nova123")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("lança BadRequestException para token expirado", async () => {
      prisma.token.findUnique.mockResolvedValue({
        id: "t1",
        tipo: "PASSWORD_RESET",
        usadoEm: null,
        userId: "u1",
        expiraEm: new Date(Date.now() - 1000),
      });

      await expect(service.redefinirSenha("tok", "nova123")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("atualiza a senha e marca o token como usado", async () => {
      prisma.token.findUnique.mockResolvedValue({
        id: "t1",
        tipo: "PASSWORD_RESET",
        usadoEm: null,
        userId: "u1",
        expiraEm: new Date(Date.now() + 3600_000),
      });

      await service.redefinirSenha("tok", "nova123");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "u1" },
        data: { senhaHash: "hashed" },
      });
      expect(prisma.token.update).toHaveBeenCalledWith({
        where: { id: "t1" },
        data: { usadoEm: expect.any(Date) },
      });
    });
  });
});
