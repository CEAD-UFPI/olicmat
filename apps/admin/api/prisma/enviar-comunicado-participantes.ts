/**
 * Comunicados por e-mail aos participantes da OLICMAT.
 *
 * Envia UM e-mail por pessoa (nunca com cópia para os demais), a todos os
 * ALUNOS com inscrição CONFIRMADA na edição ativa.
 *
 * Cada comunicado é escolhido com --mensagem <nome> (obrigatório) e tem o seu
 * próprio registro de quem já recebeu — assim um novo comunicado não é
 * "pulado" por causa de um envio anterior:
 *
 *   gravacao-live    link da live de orientação da Fase 1 (para rever)
 *   live-orientacao  convite para a live + pedido de atualização cadastral
 *                    (só pode sair no dia da live, 22/10/2026)
 *
 * Por segurança, o padrão é SIMULAR: nada é enviado sem a flag --enviar.
 *
 * Uso (dentro do container do admin-api, em PRODUÇÃO):
 *
 *   # 1) Conferir quem receberia e quantos são (não envia nada)
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --mensagem gravacao-live
 *
 *   # 2) Gerar a prévia do e-mail para olhar no navegador
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --mensagem gravacao-live --preview /tmp/previa.html
 *   docker cp olicmat-admin-api:/tmp/previa.html .
 *
 *   # 3) Enviar UM e-mail de teste para você mesmo
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --mensagem gravacao-live --teste seu@email.com
 *
 *   # 4) Enviar de verdade
 *   docker exec -it olicmat-admin-api npx tsx prisma/enviar-comunicado-participantes.ts --mensagem gravacao-live --enviar
 *
 * Opções:
 *   --limite N     envia no máximo N e-mails nesta execução (provedores têm
 *                  limite diário; o Brevo gratuito aceita ~300/dia)
 *   --forcar-data  ignora a trava de dia, nas mensagens que a têm
 *
 * Pode ser executado de novo sem medo: quem já recebeu fica registrado em um
 * arquivo por mensagem (padrão /tmp/comunicado-<mensagem>-enviados.txt; para
 * live-orientacao, o nome histórico /tmp/comunicado-participantes-enviados.txt)
 * e é pulado. Esses arquivos vivem no container: não o recrie entre execuções.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// O código compilado só existe depois do build; o caminho vai numa variável
// para o TypeScript não tentar resolvê-lo ao compilar (mesmo padrão dos demais
// scripts desta pasta).
const DIST = "../dist/src";

const LINK_LIVE = "https://youtube.com/live/BL7i-hALVZc";
const LINK_GRAVACAO = "https://www.youtube.com/live/BL7i-hALVZc";

interface Mensagem {
  assunto: string;
  html: (frontendUrl: string) => string;
  /** Se definida, o envio só é permitido neste dia (AAAA-MM-DD, Brasília). */
  soNoDia?: string;
  /** Texto exibido quando a trava de dia recusa o envio. */
  motivoDia?: string;
  /** Arquivo com os e-mails que já receberam esta mensagem. */
  arquivoLog: string;
}

function htmlLiveOrientacao(frontendUrl: string): string {
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

function htmlGravacaoLive(): string {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; line-height: 1.55;">
  <h2 style="color: #B8860B; margin-bottom: 4px;">🎥 Live de orientação sobre a prova da Fase 1</h2>

  <p>Olá, competidores e competidoras da OLICMAT!</p>

  <p>A live de orientação sobre a prova da Fase 1 está disponível no YouTube. Se você não conseguiu acompanhar ao vivo, ou quer rever as orientações e as respostas às dúvidas, é só assistir quando quiser:</p>

  <a href="${LINK_GRAVACAO}" style="display: inline-block; background-color: #E8B829; color: #1a1a1a; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 8px 0 4px;">
    Assistir no YouTube
  </a>
  <p style="color: #666; font-size: 13px;">Se o botão não funcionar, copie e cole este endereço no navegador: <a href="${LINK_GRAVACAO}" style="color: #1a5fb4;">${LINK_GRAVACAO}</a></p>

  <p>A prova da Fase 1 será aplicada em <strong>08/11/2026</strong>. Assista com atenção às orientações para chegar bem preparado(a) a essa etapa.</p>
  <p>Boa preparação! 🧮📚</p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 28px 0 14px;" />
  <p style="color: #888; font-size: 12px;">Você recebeu este e-mail por estar inscrito(a) na 1ª OLICMAT — Olimpíada para Licenciandos em Matemática.</p>
</div>`;
}

const MENSAGENS: Record<string, Mensagem> = {
  "gravacao-live": {
    assunto: "OLICMAT — Assista à live de orientação sobre a prova da Fase 1",
    html: () => htmlGravacaoLive(),
    arquivoLog: "/tmp/comunicado-gravacao-live-enviados.txt",
  },
  "live-orientacao": {
    assunto:
      "OLICMAT — Live de orientação da Fase 1 hoje, às 19h, e atualização do seu cadastro",
    html: htmlLiveOrientacao,
    // O texto fala em "Hoje": só pode sair no dia da live (fuso de Brasília).
    soNoDia: "2026-10-22",
    motivoDia: 'O texto diz "Hoje, 22/10/2026"',
    arquivoLog: "/tmp/comunicado-participantes-enviados.txt",
  },
};

const PAUSA_ENTRE_ENVIOS_MS = 250;

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
  const nomeMensagem = argumento("--mensagem");
  const mensagem = nomeMensagem ? MENSAGENS[nomeMensagem] : undefined;
  if (!mensagem) {
    throw new Error(
      `Informe a mensagem com --mensagem <nome>. Disponíveis: ${Object.keys(MENSAGENS).join(", ")}.`,
    );
  }
  const { assunto, arquivoLog } = mensagem;

  const frontendUrl = (process.env.FRONTEND_URL ?? "").replace(/\/$/, "");
  if (!frontendUrl) {
    throw new Error(
      "FRONTEND_URL não definida: o botão do cadastro ficaria sem endereço.",
    );
  }

  // --- prévia: só grava o HTML ---
  const destinoPrevia = argumento("--preview");
  if (destinoPrevia) {
    writeFileSync(destinoPrevia, mensagem.html(frontendUrl), "utf-8");
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
      existsSync(arquivoLog)
        ? readFileSync(arquivoLog, "utf-8").split("\n").filter(Boolean)
        : [],
    );
    const pendentes = emails.filter((e) => !jaEnviados.has(e));

    console.log(`Destinatários (ALUNOS com inscrição confirmada): ${emails.length}`);
    console.log(`Já receberam em execução anterior:              ${jaEnviados.size}`);
    console.log(`Faltam receber:                                  ${pendentes.length}`);

    if (!enviar && !emailTeste) {
      console.log("\nSIMULAÇÃO: nada foi enviado. Primeiros destinatários:");
      pendentes.slice(0, 8).forEach((e) => console.log(`  ${mascarar(e)}`));
      console.log("\nPara enviar de verdade, use --enviar (ou --teste seu@email.com), mantendo --mensagem.");
      return;
    }

    if (
      mensagem.soNoDia &&
      !tem("--forcar-data") &&
      hojeEmBrasilia() !== mensagem.soNoDia
    ) {
      throw new Error(
        `${mensagem.motivoDia}, mas hoje (Brasília) é ${hojeEmBrasilia()}. ` +
          "Envie no dia certo ou ajuste o texto. Para ignorar esta trava: --forcar-data.",
      );
    }

    const { EmailService } = await import(`${DIST}/email/email.service.js`);
    const { ConfigService } = await import("@nestjs/config");
    const email = new EmailService(new ConfigService());
    const html = mensagem.html(frontendUrl);

    if (emailTeste) {
      await email.sendMail(emailTeste, `[TESTE] ${assunto}`, html);
      console.log(`\nE-mail de teste enviado para ${emailTeste}.`);
      return;
    }

    const lote = pendentes.slice(0, Number.isFinite(limite) ? limite : undefined);
    console.log(`\nEnviando ${lote.length} e-mail(s)...\n`);

    let ok = 0;
    const falhas: { email: string; motivo: string }[] = [];
    for (const destino of lote) {
      try {
        await email.sendMail(destino, assunto, html);
        appendFileSync(arquivoLog, destino + "\n");
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
