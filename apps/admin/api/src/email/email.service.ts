import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/** Separa "OLICMAT <olicmat@ufpi.edu.br>" em nome e endereço. */
function separarRemetente(from: string): { name: string; email: string } {
  const comNome = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (comNome) {
    // O trim é necessário: [^>]+ é guloso e captura o espaço antes do ">".
    // Um endereço com espaço sobrando é recusado pela API.
    return { name: comNome[1].trim() || "OLICMAT", email: comNome[2].trim() };
  }
  return { name: "OLICMAT", email: from.trim() };
}

@Injectable()
export class EmailService {
  private transporter?: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: string;

  constructor(private configService: ConfigService) {
    // A rede da UFPI intercepta saída SMTP em todas as portas testadas (25,
    // 465 e 587, para Gmail, Outlook e Office 365), mas permite HTTPS. Por
    // isso o provedor padrão é a API do Brevo, que envia pela porta 443.
    // O SMTP continua disponível para desenvolvimento e para o caso de a
    // política de rede mudar.
    this.provider = (
      this.configService.get("EMAIL_PROVIDER") || "brevo"
    ).toLowerCase();

    if (this.provider === "smtp") {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get("SMTP_HOST"),
        port: Number(this.configService.get("SMTP_PORT")),
        // 465 usa TLS implícito; 587 negocia com STARTTLS.
        secure: Number(this.configService.get("SMTP_PORT")) === 465,
        auth: {
          user: this.configService.get("SMTP_USER"),
          pass: this.configService.get("SMTP_PASS"),
        },
      });
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    const from =
      this.configService.get("SMTP_FROM") || "OLICMAT <olicmat@ufpi.edu.br>";

    try {
      if (this.provider === "smtp") {
        if (!this.transporter) {
          throw new Error("Transporte SMTP não inicializado");
        }
        await this.transporter.sendMail({ from, to, subject, html });
      } else {
        await this.enviarViaBrevo(from, to, subject, html);
      }
      this.logger.log(`Email enviado para ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`);
      throw error;
    }
  }

  private async enviarViaBrevo(
    from: string,
    to: string,
    subject: string,
    html: string,
  ) {
    const apiKey = this.configService.get("BREVO_API_KEY");
    if (!apiKey) {
      throw new Error(
        "BREVO_API_KEY não configurada. Defina-a ou use EMAIL_PROVIDER=smtp.",
      );
    }

    const resposta = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: separarRemetente(from),
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!resposta.ok) {
      // O corpo do erro do Brevo diz o motivo real (remetente não verificado,
      // cota estourada, chave inválida). Sem ele, o diagnóstico vira adivinhação.
      const detalhe = await resposta.text().catch(() => "");
      throw new Error(
        `Brevo respondeu ${resposta.status}: ${detalhe.slice(0, 300)}`,
      );
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

  /**
   * Convite para quem ainda não tem cadastro. Diferente de
   * `enviarDefinicaoSenha`, que pressupõe um usuário já criado, este link
   * leva a um formulário onde a própria pessoa informa os dados que a
   * organização não tem — CPF, data de nascimento — e escolhe a senha.
   */
  async enviarConvite(
    email: string,
    nome: string,
    token: string,
    papel: string,
  ) {
    const link = `${this.configService.get("FRONTEND_URL")}/convite?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Convite de Cadastro</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Você foi convidado a integrar a plataforma da OLICMAT como <strong>${papel}</strong>.</p>
        <p>Para concluir seu cadastro e definir sua senha, clique no botão abaixo:</p>
        <a href="${link}" style="display: inline-block; background-color: #E8B829; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Concluir Meu Cadastro
        </a>
        <p style="color: #666; font-size: 12px;">Este link expira em 7 dias e só pode ser usado uma vez. Se você não esperava este convite, ignore este e-mail.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Importante:</strong> logo após criar sua conta, é obrigatório concluir a inscrição na edição vigente da OLICMAT. Tenha em mãos o seu <strong>comprovante de matrícula</strong> antes de iniciar o cadastro, pois ele será solicitado durante a inscrição.</p>
      </div>
    `;
    await this.sendMail(email, "Convite de Cadastro — OLICMAT", html);
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

  async enviarStatusInscricao(
    email: string,
    nome: string,
    status: "CONFIRMADA" | "REJEITADA",
    justificativa?: string,
  ) {
    const confirmada = status === "CONFIRMADA";
    const html = confirmada
      ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Inscrição Confirmada</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Sua inscrição na OLICMAT foi <strong>confirmada</strong> pela coordenação do seu curso.</p>
        <p>Acesse o painel para acompanhar os próximos passos.</p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Inscrição Rejeitada</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Sua inscrição na OLICMAT foi <strong>rejeitada</strong> pela coordenação do seu curso.</p>
        <p><strong>Motivo:</strong> ${justificativa}</p>
        <p>Você pode corrigir os dados e reenviar sua inscrição pelo painel, enquanto o prazo de inscrição da edição estiver aberto.</p>
      </div>
    `;
    await this.sendMail(
      email,
      confirmada ? "Inscrição Confirmada — OLICMAT" : "Inscrição Rejeitada — OLICMAT",
      html,
    );
  }
}
