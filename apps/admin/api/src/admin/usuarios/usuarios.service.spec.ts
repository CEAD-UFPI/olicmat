import { jest } from "@jest/globals";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { AdminUsuariosService } from "./usuarios.service.js";

describe("AdminUsuariosService — reenviarLinkDefinicaoSenha", () => {
  let service: AdminUsuariosService;
  let prisma: any;
  let auditoria: any;
  let email: any;

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn() },
      token: { deleteMany: jest.fn(), create: jest.fn() },
    };
    auditoria = { log: jest.fn(async () => undefined) };
    email = { enviarDefinicaoSenha: jest.fn(async () => undefined) };
    service = new AdminUsuariosService(prisma as any, auditoria as any, email as any);
  });

  it("invalida o token anterior, emite um novo (7 dias) e reenvia o e-mail", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "aluno@ex.com",
      nome: "Aluno",
      role: "ALUNO",
      coordenadorId: "coord1",
    });

    const resultado = await service.reenviarLinkDefinicaoSenha("u1", {
      id: "coord1",
      role: "COORDENADOR_CURSO",
    });

    expect(prisma.token.deleteMany).toHaveBeenCalledWith({
      where: { userId: "u1", tipo: "PASSWORD_RESET", usadoEm: null },
    });
    expect(prisma.token.create).toHaveBeenCalledTimes(1);
    const dadosToken = (prisma.token.create.mock.calls[0] as any[])[0].data;
    expect(dadosToken.userId).toBe("u1");
    expect(dadosToken.tipo).toBe("PASSWORD_RESET");
    const validadeMs = dadosToken.expiraEm.getTime() - Date.now();
    expect(validadeMs).toBeGreaterThan(6 * 24 * 60 * 60 * 1000);
    expect(validadeMs).toBeLessThanOrEqual(7 * 24 * 60 * 60 * 1000);
    expect(email.enviarDefinicaoSenha).toHaveBeenCalledWith(
      "aluno@ex.com",
      "Aluno",
      dadosToken.token,
    );
    expect(auditoria.log).toHaveBeenCalledWith(
      "coord1",
      "REENVIAR_LINK_SENHA",
      "User",
      "u1",
      { email: "aluno@ex.com" },
    );
    expect(resultado).toEqual({ message: "Link reenviado" });
  });

  it("recusa quando o aluno não pertence ao coordenador que está chamando", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "aluno@ex.com",
      nome: "Aluno",
      role: "ALUNO",
      coordenadorId: "outro-coord",
    });

    await expect(
      service.reenviarLinkDefinicaoSenha("u1", { id: "coord1", role: "COORDENADOR_CURSO" }),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.token.deleteMany).not.toHaveBeenCalled();
    expect(email.enviarDefinicaoSenha).not.toHaveBeenCalled();
  });

  it("levanta NotFoundException quando o usuário não existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.reenviarLinkDefinicaoSenha("inexistente", { id: "admin1", role: "ADMIN" }),
    ).rejects.toThrow(NotFoundException);
  });
});
