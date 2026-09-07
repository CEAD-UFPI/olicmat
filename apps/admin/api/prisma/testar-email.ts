/**
 * Envia um e-mail de teste pelo provedor configurado.
 *
 * Serve para validar credenciais, remetente e conectividade sem gastar um
 * convite real nem depender de alguém confirmar recebimento de um fluxo de
 * produção.
 *
 * Uso (dentro do container do admin-api):
 *
 *   docker exec olicmat-admin-api npx tsx prisma/testar-email.ts voce@ufpi.edu.br
 */
import { NestFactory } from "@nestjs/core";

// O compilado só existe depois do build; o caminho vai numa variável para o
// TypeScript não tentar resolvê-lo em tempo de compilação.
const DIST = "../dist/src";

async function main() {
  const destino = process.argv[2];
  if (!destino || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destino)) {
    throw new Error(
      "Informe o destinatário: npx tsx prisma/testar-email.ts voce@ufpi.edu.br",
    );
  }

  console.log(`Provedor : ${process.env.EMAIL_PROVIDER || "brevo (padrão)"}`);
  console.log(`Remetente: ${process.env.SMTP_FROM || "(não definido)"}`);
  console.log(`Destino  : ${destino}\n`);

  const { AppModule } = await import(`${DIST}/app.module.js`);
  const { EmailService } = await import(`${DIST}/email/email.service.js`);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  try {
    const email = app.get(EmailService);
    const agora = new Date().toISOString();

    await email.sendMail(
      destino,
      "Teste de envio — OLICMAT",
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E8B829;">OLICMAT — Teste de envio</h2>
        <p>Se você está lendo isto, o envio de e-mail do sistema está funcionando.</p>
        <p style="color: #666; font-size: 12px;">Enviado em ${agora}</p>
      </div>`,
    );

    console.log("Enviado com sucesso.");
    console.log("Confira a caixa de entrada — e também o spam.");
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
});
