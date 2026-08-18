import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: true,
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const from = this.configService.get("SMTP_FROM") || "OLICMAT <olicmat@ufpi.edu.br>";

    try {
      await this.transporter.sendMail({ from, to, subject, html });
      this.logger.log(`Email enviado para ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`);
      throw error;
    }
  }

  async enviarConfirmacaoEmail(email: string, nome: string, token: string) {
    const link = `${this.configService.get("FRONTEND_URL")}/confirmar-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Confirmação de E-mail</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Obrigado por se inscrever na 1ª OLICMAT — Ensino Superior.</p>
        <p>Para confirmar seu e-mail, clique no botão abaixo:</p>
        <a href="${link}" style="display: inline-block; background-color: #E8B829; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Confirmar E-mail
        </a>
        <p style="color: #666; font-size: 12px;">Se você não se inscreveu na OLICMAT, ignore este e-mail.</p>
      </div>
    `;
    await this.sendMail(email, "Confirme seu e-mail — OLICMAT", html);
  }

  async enviarRecuperacaoSenha(email: string, nome: string, token: string) {
    const link = `${this.configService.get("FRONTEND_URL")}/redefinir-senha?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Recuperação de Senha</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${link}" style="display: inline-block; background-color: #E8B829; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Redefinir Senha
        </a>
        <p style="color: #666; font-size: 12px;">Este link expira em 2 horas. Se você não solicitou a redefinição, ignore este e-mail.</p>
      </div>
    `;
    await this.sendMail(email, "Recuperação de Senha — OLICMAT", html);
  }

  async enviarDefinicaoSenha(email: string, nome: string, token: string) {
    const link = `${this.configService.get("FRONTEND_URL")}/redefinir-senha?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Criação de Senha</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Você foi cadastrado na plataforma OLICMAT.</p>
        <p>Para criar a sua senha de acesso ao sistema, clique no botão abaixo:</p>
        <a href="${link}" style="display: inline-block; background-color: #E8B829; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Criar Minha Senha
        </a>
        <p style="color: #666; font-size: 12px;">Este link expira em 24 horas. Se você não esperava este cadastro, ignore este e-mail.</p>
      </div>
    `;
    await this.sendMail(email, "Criação de Senha — OLICMAT", html);
  }

  async enviarResultadoProva(email: string, nome: string, nota: number, medalha?: string) {
    const medalhaEmoji = medalha === "OURO" ? "🥇" : medalha === "PRATA" ? "🥈" : medalha === "BRONZE" ? "🥉" : "";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Resultado da Fase 1</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Sua nota na Fase 1 foi: <strong style="font-size: 24px; color: #E8B829;">${nota.toFixed(1)}</strong></p>
        ${medalha ? `<p>${medalhaEmoji} <strong>Parabéns! Você conquistou a medalha de ${medalha}!</strong></p>` : ""}
        <p>Acesse o painel para mais detalhes.</p>
      </div>
    `;
    await this.sendMail(email, "Resultado da Fase 1 — OLICMAT", html);
  }
}
