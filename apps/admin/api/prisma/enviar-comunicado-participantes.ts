/**
 * Comunicado a todos os participantes da OLICMAT: convite para a live de
 * orientação da Fase 1 + pedido para completarem o cadastro.
 *
 * Envia UM e-mail por pessoa (nunca com cópia para os demais), a todos os
 * ALUNOS com inscrição CONFIRMADA na edição ativa.
 *
 * Por segurança, o padrão é SIMULAR: nada é enviado sem a flag --enviar.
 *
 * Uso (dentro do container do admin-api, em PRODUÇÃO):
 *
 *   # 1) Conferir quem receberia e quantos são (não envia nada)
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts
 *
 *   # 2) Gerar a prévia do e-mail para olhar no navegador
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --preview /tmp/previa.html
 *   docker cp olicmat-admin-api:/tmp/previa.html .
 *
 *   # 3) Enviar UM e-mail de teste para você mesmo
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --teste seu@email.com
 *
 *   # 4) Enviar de verdade
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --enviar
 *
 * Opções:
 *   --limite N     envia no máximo N e-mails nesta execução (provedores têm
 *                  limite diário; o Brevo gratuito aceita ~300/dia)
 *   --forcar-data  ignora a trava que só permite o envio no dia da live
 *
 * Pode ser executado de novo sem medo: quem já recebeu fica registrado em
 * COMUNICADO_LOG (padrão /tmp/comunicado-participantes-enviados.txt) e é
 * pulado. Esse arquivo vive no container: não o recrie entre execuções.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// O código compilado só existe depois do build; o caminho vai numa variável
// para o TypeScript não tentar resolvê-lo ao compilar (mesmo padrão dos demais
// scripts desta pasta).
const DIST = "../dist/src";

/** O texto fala em "Hoje": só pode sair no dia da live (fuso de Brasília). */
const DIA_DA_LIVE = "2026-10-22";
const LINK_LIVE = "https://youtube.com/live/BL7i-hALVZc";
const ASSUNTO =
  "OLICMAT — Live de orientação da Fase 1 hoje, às 19h, e atualização do seu cadastro";

const LOG_ENVIADOS =
  process.env.COMUNICADO_LOG ?? "/tmp/comunicado-participantes-enviados.txt";
const PAUSA_ENTRE_ENVIOS_MS = 250;

function montarHtml(frontendUrl: string): string {
  const perfil = `${frontendUrl}/perfil`;
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; line-height: 1.55;">
  <h2 style="color: #B8860B; margin-bottom: 4px;">📣 Atenção, competidores e competidoras da OLICMAT!</h2>

  <p>Convidamos vocês para uma live de orientação sobre a prova da Fase 1!</p>

  <div style="background: #FBF6E4; border-left: 4px solid #E8B829; border-radius: 6px; padding: 14px 18px; margin: 16px 0;">
    <p style="margin: 0 0 6px;">📅 <strong>Hoje, 22/10/2026</strong></p>
    <p style="margin: 0 0 6px;">🕘 <strong>Às 19h</strong> (horário de Brasília)</p>
    <p style="margin: 0;">Link: <a href="${LINK_LIVE}" style="color: #1a5fb4;">${LINK_LIVE}</a></p>
  </div>

  <p>Será um momento para apresentar orientações sobre a prova e esclarecer dúvidas, ajudando vocês a se prepararem para essa etapa.</p>
  <p>Contamos com a participação de todos e todas! 🧮📚</p>

  <a href="${LINK_LIVE}" style="display: inline-block; background-color: #E8B829; color: #1a1a1a; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 8px 0 4px;">
    Assistir à live
  </a>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 28px 0;" />

  <h3 style="color: #B8860B; margin-bottom: 4px;">📝 Complete o seu cadastro</h3>
  <p>Os dados do cadastro de todos os participantes são necessários para a organização da OLICMAT e para os levantamentos da olimpíada. Por isso, pedimos que você <strong>preencha todos os campos do seu cadastro</strong> e confira se as informações estão corretas.</p>

  <p style="margin-bottom: 6px;"><strong>Como fazer:</strong></p>
  <ol style="margin-top: 0; padding-left: 22px;">
    <li>Entre no sistema com o seu e-mail e a sua senha.</li>
    <li>Clique em <strong>Editar perfil</strong>, logo abaixo do seu nome, no menu à esquerda.</li>
    <li>Preencha todos os campos — dados pessoais, documentos e endereço — e clique em <strong>Salvar alterações</strong>.</li>
  </ol>

  <a href="${perfil}" style="display: inline-block; background-color: #1a5fb4; color: #ffffff; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 8px 0 4px;">
    Atualizar meu cadastro
  </a>
  <p style="color: #666; font-size: 13px;">Leva poucos minutos. Se o botão não funcionar, copie e cole este endereço no navegador: ${perfil}</p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 28px 0 14px;" />
  <p style="color: #888; font-size: 12px;">Você recebeu este e-mail por estar inscrito(a) na 1ª OLICMAT — Olimpíada para Licenciandos em Matemática.</p>
</div>`;
}

function argumento(nome: string): string | undefined {
  const i = process.argv.indexOf(nome);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const tem = (flag: string) => process.argv.includes(flag);

/** Data de hoje no fuso de Brasília, no formato AAAA-MM-DD. */
function hojeEmBrasilia(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });
}

const mascarar = (email: string) => email.replace(/^(.{2}).*(@.*)$/, "$1***$2");
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const frontendUrl = (process.env.FRONTEND_URL ?? "").replace(/\/$/, "");
  if (!frontendUrl) {
    throw new Error(
      "FRONTEND_URL não definida: o botão do cadastro ficaria sem endereço.",
    );
  }

  // --- prévia: só grava o HTML ---
  const destinoPrevia = argumento("--preview");
  if (destinoPrevia) {
    writeFileSync(destinoPrevia, montarHtml(frontendUrl), "utf-8");
    console.log(`Prévia gravada em ${destinoPrevia}`);
    return;
  }

  const emailTeste = argumento("--teste");
  const enviar = tem("--enviar");
  const limite = Number(argumento("--limite") ?? Infinity);

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    const alunos = await prisma.user.findMany({
      where: {
        role: "ALUNO",
        email: { not: { endsWith: ".local" } },
        inscricoes: {
          some: { status: "CONFIRMADA", edicao: { status: "ATIVA" } },
        },
      },
      select: { email: true },
      orderBy: { email: "asc" },
    });

    const emails = [...new Set(alunos.map((a) => a.email.trim().toLowerCase()))];
    const jaEnviados = new Set(
      existsSync(LOG_ENVIADOS)
        ? readFileSync(LOG_ENVIADOS, "utf-8").split("\n").filter(Boolean)
        : [],
    );
    const pendentes = emails.filter((e) => !jaEnviados.has(e));

    console.log(`Destinatários (ALUNOS com inscrição confirmada): ${emails.length}`);
    console.log(`Já receberam em execução anterior:              ${jaEnviados.size}`);
    console.log(`Faltam receber:                                  ${pendentes.length}`);

    if (!enviar && !emailTeste) {
      console.log("\nSIMULAÇÃO: nada foi enviado. Primeiros destinatários:");
      pendentes.slice(0, 8).forEach((e) => console.log(`  ${mascarar(e)}`));
      console.log("\nPara enviar de verdade, use --enviar (ou --teste seu@email.com).");
      return;
    }

    if (!tem("--forcar-data") && hojeEmBrasilia() !== DIA_DA_LIVE) {
      throw new Error(
        `O texto diz "Hoje, 22/10/2026", mas hoje (Brasília) é ${hojeEmBrasilia()}. ` +
          "Envie no dia da live ou ajuste o texto. Para ignorar esta trava: --forcar-data.",
      );
    }

    const { EmailService } = await import(`${DIST}/email/email.service.js`);
    const { ConfigService } = await import("@nestjs/config");
    const email = new EmailService(new ConfigService());
    const html = montarHtml(frontendUrl);

    if (emailTeste) {
      await email.sendMail(emailTeste, `[TESTE] ${ASSUNTO}`, html);
      console.log(`\nE-mail de teste enviado para ${emailTeste}.`);
      return;
    }

    const lote = pendentes.slice(0, Number.isFinite(limite) ? limite : undefined);
    console.log(`\nEnviando ${lote.length} e-mail(s)...\n`);

    let ok = 0;
    const falhas: { email: string; motivo: string }[] = [];
    for (const destino of lote) {
      try {
        await email.sendMail(destino, ASSUNTO, html);
        appendFileSync(LOG_ENVIADOS, destino + "\n");
        ok++;
        if (ok % 25 === 0) console.log(`  ${ok}/${lote.length} enviados`);
      } catch (e) {
        falhas.push({ email: destino, motivo: e instanceof Error ? e.message : String(e) });
      }
      await dormir(PAUSA_ENTRE_ENVIOS_MS);
    }

    console.log(`\nEnviados: ${ok}`);
    if (falhas.length) {
      console.log(`Falharam: ${falhas.length} (rode de novo para tentar só esses)`);
      falhas.slice(0, 20).forEach((f) => console.log(`  ${mascarar(f.email)} — ${f.motivo}`));
    }
    const restantes = pendentes.length - ok;
    if (restantes > 0) {
      console.log(`\nAinda faltam ${restantes}. Rode o mesmo comando de novo para continuar.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
});
