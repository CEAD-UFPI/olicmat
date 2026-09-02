import { jest } from "@jest/globals";
import { UnauthorizedException, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { TOKEN_TYPE } from "@olicmat/shared";

describe("AuthService (exam-api)", () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn() },
      inscricao: { findFirst: jest.fn() },
    };
    jwtService = { verify: jest.fn(), sign: jest.fn(() => "session-token") };
    service = new AuthService(prisma as any, jwtService as any);
  });

  describe("claimTransitionToken", () => {
    it("lança UnauthorizedException quando o token é inválido", async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error("invalid signature");
      });

      await expect(service.claimTransitionToken("bad")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("lança UnauthorizedException quando o tipo do token não é de transição", async () => {
      jwtService.verify.mockReturnValue({ sub: "u1", type: "OUTRO" });

      await expect(service.claimTransitionToken("tok")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("lança UnauthorizedException quando o usuário não existe", async () => {
      jwtService.verify.mockReturnValue({ sub: "u1", type: TOKEN_TYPE.EXAM_TRANSITION });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.claimTransitionToken("tok")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("lança BadRequestException quando ALUNO sem inscrição confirmada", async () => {
      jwtService.verify.mockReturnValue({ sub: "u1", type: TOKEN_TYPE.EXAM_TRANSITION });
      prisma.user.findUnique.mockResolvedValue({
        id: "u1", email: "a@x.com", role: "ALUNO", nome: "Ana",
      });
      prisma.inscricao.findFirst.mockResolvedValue(null);

      await expect(service.claimTransitionToken("tok")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("retorna usuário e accessToken para ALUNO confirmado", async () => {
      jwtService.verify.mockReturnValue({ sub: "u1", type: TOKEN_TYPE.EXAM_TRANSITION });
      prisma.user.findUnique.mockResolvedValue({
        id: "u1", email: "a@x.com", role: "ALUNO", nome: "Ana",
      });
      prisma.inscricao.findFirst.mockResolvedValue({ id: "i1", status: "CONFIRMADA" });

      const result = await service.claimTransitionToken("tok");

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ scope: TOKEN_TYPE.EXAM_SESSION }),
        expect.objectContaining({ expiresIn: expect.any(String) }),
      );
      expect(result.accessToken).toBe("session-token");
      expect(result.user.id).toBe("u1");
    });

    it("retorna usuário e accessToken sem checar inscrição para papéis não-ALUNO", async () => {
      jwtService.verify.mockReturnValue({ sub: "u1", type: TOKEN_TYPE.EXAM_TRANSITION });
      prisma.user.findUnique.mockResolvedValue({
        id: "u1", email: "admin@x.com", role: "ADMIN", nome: "Admin",
      });

      const result = await service.claimTransitionToken("tok");

      expect(prisma.inscricao.findFirst).not.toHaveBeenCalled();
      expect(result.accessToken).toBe("session-token");
    });
  });
});
