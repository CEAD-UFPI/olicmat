import { ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service.js";
import { jest } from "@jest/globals";

describe("EmailService", () => {
  let service: EmailService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          SMTP_HOST: "smtp.gmail.com",
          SMTP_PORT: 465,
          SMTP_USER: "test@example.com",
          SMTP_PASS: "testpass",
          SMTP_FROM: "Test <test@example.com>",
          FRONTEND_URL: "http://localhost:3000",
        };
        return config[key];
      }),
    };
    service = new EmailService(mockConfigService as ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("enviarConfirmacaoEmail", () => {
    it("should generate correct confirmation link", async () => {
      const sendMailSpy = jest.spyOn(service as any, "sendMail").mockResolvedValue(undefined);

      await service.enviarConfirmacaoEmail("user@test.com", "Test User", "abc123");

      expect(sendMailSpy).toHaveBeenCalledWith(
        "user@test.com",
        expect.stringContaining("Confirme"),
        expect.stringContaining("token=abc123"),
      );
    });
  });

  describe("enviarRecuperacaoSenha", () => {
    it("should generate correct reset link", async () => {
      const sendMailSpy = jest.spyOn(service as any, "sendMail").mockResolvedValue(undefined);

      await service.enviarRecuperacaoSenha("user@test.com", "Test User", "reset456");

      expect(sendMailSpy).toHaveBeenCalledWith(
        "user@test.com",
        expect.stringContaining("Recuperação"),
        expect.stringContaining("token=reset456"),
      );
    });
  });
});
