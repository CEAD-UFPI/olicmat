// E-mail aos classificados: prorrogação do prazo da Fase 2 e liberação de reenvio.
// Usa o mesmo EmailService da API (Brevo/SMTP conforme o .env do container).
// O prazo exibido é lido do banco: rode depois de scripts/prorrogar-fase2.ts --commit.
//
// Uso (dentro do container admin-api):
//   npx tsx scripts/comunicar-prorrogacao-fase2.ts                          # simulação (mostra o texto)
//   npx tsx scripts/comunicar-prorrogacao-fase2.ts --teste voce@exemplo.com # envia 1 e-mail de teste
//   npx tsx scripts/comunicar-prorrogacao-fase2.ts --commit --actor <adminId>
//   npx tsx scripts/comunicar-prorrogacao-fase2.ts --commit --actor <adminId> --apenas-falhas
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { EmailService } from "../dist/src/email/email.service.js";

const argv = process.argv.slice(2);
const valor = (n: string) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const commit = argv.includes("--commit");
const apenasFalhas = argv.includes("--apenas-falhas");
const teste = valor("--teste");
const actor = valor("--actor");
const ARQ_FALHAS = join(dirname(fileURLToPath(import.meta.url)), "prorrogacao-falhas.json");

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (d: Date) =>
  d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** "23h59 de 20/11/2026" */
const prazoExtenso = (d: Date) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.hour}h${p.minute} de ${p.day}/${p.month}/${p.year}`;
};

const ASSUNTO = "Prorrogação do prazo da Fase 2 — OLICMAT";
function html(nome: string, tema: string, prazo: Date) {
  const site = process.env.SITE_URL || "https://olicmat.cead.ufpi.br";
  const envio = `${process.env.FRONTEND_URL || "https://admin.olicmat.cead.ufpi.br"}/competidor/envio`;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #E8B829;">OLICMAT — Prorrogação do prazo da Fase 2</h2>
      <p>Olá, <strong>${esc(nome)}</strong>!</p>
      <p>Conforme a retificação do edital, o prazo para envio dos arquivos da Fase 2 foi <strong>prorrogado até as ${prazoExtenso(prazo)} (horário de Brasília)</strong>.</p>
      <p><strong>Competência sorteada:</strong> ${esc(tema)}</p>
      <ul>
        <li>Se ainda falta enviar a <strong>videoaula</strong> ou o <strong>portfólio</strong>, envie normalmente pela plataforma, com o seu login e senha.</li>
        <li>Se precisar, você também pode <strong>enviar novamente</strong> a videoaula e o portfólio — <strong>uma vez cada arquivo</strong>. O arquivo atual continua valendo até o novo envio terminar.</li>
        <li>Se você já enviou os dois arquivos e está tudo certo, não é preciso fazer nada.</li>
      </ul>
      <p>Comece com antecedência: vídeos grandes podem levar tempo para subir. Após o novo prazo, o envio é encerrado automaticamente.</p>
      <p><a href="${envio}" style="color: #E8B829;">Acessar o envio da Fase 2</a> · <a href="${site}/tutorial-fase2" style="color: #E8B829;">Tutorial da Fase 2</a></p>
      <p>Comissão Organizadora da OLICMAT</p>
    </div>
  `;
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
  if (!edicao?.fase2PrazoEm || !edicao.fase2Tema) throw new Error("A Fase 2 não foi iniciada.");
  if (edicao.fase2PrazoEm.getTime() <= Date.now()) throw new Error(`O prazo gravado (${fmt(edicao.fase2PrazoEm)}) já passou. Rode antes o prorrogar-fase2.ts --commit.`);
  const prazo = edicao.fase2PrazoEm;

  let alvos = (await prisma.inscricao.findMany({
    where: { edicaoId: edicao.id, fase2Classificado: true },
    select: { user: { select: { email: true, nome: true, nomeSocial: true } } },
    orderBy: { user: { nome: "asc" } },
  })).map((i) => ({ email: i.user.email, nome: i.user.nomeSocial || i.user.nome }));

  console.log(`Prazo gravado no banco: ${fmt(prazo)} (Brasília)`);
  console.log(`Competência: ${edicao.fase2Tema}`);
  console.log(`Assunto: ${ASSUNTO}`);
  console.log(`Remetente: ${process.env.SMTP_FROM || "OLICMAT <olicmat@ufpi.edu.br>"} via ${process.env.EMAIL_PROVIDER || "brevo"}`);

  const email = new EmailService({ get: (k: string) => process.env[k] } as never);

  if (teste) {
    await email.sendMail(teste, `[TESTE] ${ASSUNTO}`, html(alvos[0]?.nome ?? "Participante", edicao.fase2Tema, prazo));
    console.log(`\nE-mail de TESTE enviado para ${teste}. Confira e depois rode com --commit.`);
  } else if (!commit) {
    console.log(`\nDestinatários: ${alvos.length} classificados.`);
    console.log("\n--- Texto do e-mail (para o 1º destinatário) ---");
    console.log(html(alvos[0]?.nome ?? "Participante", edicao.fase2Tema, prazo).replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim());
    console.log("\nSimulação: nada foi enviado. Use --teste <seu e-mail> e depois --commit --actor <adminId>.");
  } else {
    if (!actor) throw new Error("Informe --actor <id do admin>.");
    if (apenasFalhas) {
      if (!existsSync(ARQ_FALHAS)) throw new Error("Não há arquivo de falhas de uma rodada anterior.");
      const falhas = new Set(JSON.parse(readFileSync(ARQ_FALHAS, "utf-8")) as string[]);
      alvos = alvos.filter((a) => falhas.has(a.email));
    }
    console.log(`\nEnviando para ${alvos.length} destinatário(s)...`);
    const falhas: string[] = [];
    let enviados = 0;
    for (const a of alvos) {
      try {
        await email.sendMail(a.email, ASSUNTO, html(a.nome, edicao.fase2Tema, prazo));
        enviados++;
      } catch (e) {
        falhas.push(a.email);
        console.error(`  FALHA ${a.email}: ${(e as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, 150));
    }
    writeFileSync(ARQ_FALHAS, JSON.stringify(falhas, null, 2));
    await prisma.auditLog.create({
      data: { actorId: actor, acao: "COMUNICAR_PRORROGACAO_FASE2", entidade: "Edicao", entidadeId: edicao.id, payload: { prazo: prazo.toISOString(), enviados, falhas: falhas.length, apenasFalhas } },
    });
    console.log(`\nConcluído: ${enviados} enviados, ${falhas.length} falhas.`);
    if (falhas.length) console.log("Para reenviar só as falhas: repita com --apenas-falhas.");
  }
} catch (e) {
  console.error("ERRO:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
