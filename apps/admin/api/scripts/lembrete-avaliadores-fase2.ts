// Lembrete por e-mail aos avaliadores com avaliações PENDENTES da Fase 2.
// Cada avaliador recebe a lista dos seus pendentes (há quanto tempo estão com
// ele), quanto falta para o encerramento e o link para avaliar.
//
// Uso (dentro do container admin-api):
//   npx tsx scripts/lembrete-avaliadores-fase2.ts                                   # simulação
//   npx tsx scripts/lembrete-avaliadores-fase2.ts --teste voce@exemplo.com           # 1 e-mail de teste
//   npx tsx scripts/lembrete-avaliadores-fase2.ts --commit --actor <adminId>
//   npx tsx scripts/lembrete-avaliadores-fase2.ts --commit --actor <adminId> --apenas-falhas
// Opcional: --prazo 2026-11-29T23:59:59-03:00 (encerramento das avaliações; padrão: 29/11/2026, 23h59)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
const prazoTxt = valor("--prazo") ?? "2026-11-29T23:59:59-03:00";
const ARQ_FALHAS = join(dirname(fileURLToPath(import.meta.url)), "lembrete-avaliadores-falhas.json");

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const partes = (d: Date) => Object.fromEntries(
  new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(d).map((x) => [x.type, x.value]),
);
const dataHora = (d: Date) => { const p = partes(d); return `${p.day}/${p.month}/${p.year}, ${p.hour}h${p.minute}`; };
const extenso = (d: Date) => { const p = partes(d); return `${p.hour}h${p.minute} de ${p.day}/${p.month}/${p.year}`; };
/** "3 dias e 4 horas" / "5 horas" / "menos de 1 hora" */
function duracao(ms: number) {
  if (ms < 3600_000) return "menos de 1 hora";
  const h = Math.floor(ms / 3600_000), d = Math.floor(h / 24), r = h % 24;
  const dias = d ? `${d} dia${d > 1 ? "s" : ""}` : "";
  const horas = r ? `${r} hora${r > 1 ? "s" : ""}` : "";
  return [dias, horas].filter(Boolean).join(" e ");
}

interface Pendente { numero: number; nome: string; instituicao: string; atribuidoEm: Date; ordem: number; rascunho: boolean }

function html(nome: string, pendentes: Pendente[], prazo: Date, agora: Date) {
  const admin = process.env.FRONTEND_URL || "https://admin.olicmat.cead.ufpi.br";
  const site = process.env.SITE_URL || "https://olicmat.cead.ufpi.br";
  const restante = prazo.getTime() - agora.getTime();
  const linhas = pendentes
    .sort((a, b) => a.atribuidoEm.getTime() - b.atribuidoEm.getTime())
    .map((p) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">nº ${p.numero} — ${esc(p.nome)}${p.ordem === 3 ? " <em>(3º avaliador)</em>" : ""}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:nowrap;">${dataHora(p.atribuidoEm)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:nowrap;"><strong>${duracao(agora.getTime() - p.atribuidoEm.getTime())}</strong>${p.rascunho ? "<br><span style=\"color:#777;font-size:12px;\">rascunho salvo</span>" : ""}</td>
        </tr>`).join("");
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color:#222;">
      <h2 style="color: #E8B829;">OLICMAT — Avaliações pendentes da Fase 2</h2>
      <p>Olá, <strong>${esc(nome)}</strong>!</p>
      <p>Você tem <strong>${pendentes.length} ${pendentes.length > 1 ? "avaliações pendentes" : "avaliação pendente"}</strong> na 2ª Fase da OLICMAT:</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <thead><tr style="background:#f6f1e1;text-align:left;">
          <th style="padding:6px 8px;">Participante</th><th style="padding:6px 8px;">Recebido em</th><th style="padding:6px 8px;">Pendente há</th>
        </tr></thead>
        <tbody>${linhas}</tbody>
      </table>
      <p style="margin-top:18px;padding:12px;background:#fff6dc;border-left:4px solid #E8B829;">
        ${restante > 0
          ? `<strong>As avaliações se encerram às ${extenso(prazo)} (horário de Brasília) — faltam ${duracao(restante)}.</strong>`
          : `<strong>O período de avaliação terminou às ${extenso(prazo)} (horário de Brasília).</strong> Conclua as pendentes o quanto antes.`}
      </p>
      <p>Esta é a etapa que define o resultado da Olimpíada: cada participante dedicou tempo e esforço à videoaula e ao portfólio, e
      a classificação final <strong>só sai quando todas as avaliações estiverem concluídas</strong>. Por isso, a conclusão das suas
      avaliações depende exclusivamente de você — e faz toda a diferença para os participantes e para a OLICMAT.</p>
      <p>Lembre-se: use “Salvar rascunho” se precisar continuar depois e clique em <strong>“Concluir avaliação”</strong> quando terminar
      (depois de concluída, a avaliação não pode ser alterada).</p>
      <p style="margin:22px 0;">
        <a href="${admin}/avaliador/fase2" style="background:#E8B829;color:#111;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Acessar minhas avaliações</a>
      </p>
      <p style="font-size:13px;color:#555;">Dúvidas sobre a plataforma ou os critérios? Veja o <a href="${site}/tutorial-avaliador" style="color:#b8860b;">Tutorial do Avaliador</a> ou fale com a Comissão Organizadora.</p>
      <p>Muito obrigado pela sua dedicação!<br>Comissão Organizadora da OLICMAT</p>
    </div>`;
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  if (!/[+-]\d\d:\d\d$|Z$/.test(prazoTxt)) throw new Error("--prazo precisa do fuso, ex.: 2026-11-29T23:59:59-03:00");
  const prazo = new Date(prazoTxt);
  if (Number.isNaN(prazo.getTime())) throw new Error("Prazo inválido.");
  const agora = new Date();
  const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
  if (!edicao) throw new Error("Nenhuma edição.");

  const pend = await prisma.atribuicaoFase2.findMany({
    where: { status: "PENDENTE", inscricao: { edicaoId: edicao.id } },
    select: {
      inscricaoId: true, avaliadorId: true, ordem: true, atribuidoEm: true,
      avaliador: { select: { nome: true, nomeSocial: true, email: true } },
      inscricao: { select: { numero: true, user: { select: { nome: true, nomeSocial: true } }, instituicao: { select: { sigla: true } } } },
    },
  });
  const rascunhos = new Set((await prisma.avaliacaoFase2.findMany({
    where: { concluida: false, inscricao: { edicaoId: edicao.id } },
    select: { inscricaoId: true, avaliadorId: true },
  })).map((r) => `${r.inscricaoId}|${r.avaliadorId}`));

  const porAvaliador = new Map<string, { nome: string; email: string; pendentes: Pendente[] }>();
  for (const a of pend) {
    const g = porAvaliador.get(a.avaliadorId) ?? { nome: a.avaliador.nomeSocial || a.avaliador.nome, email: a.avaliador.email, pendentes: [] };
    g.pendentes.push({
      numero: a.inscricao.numero,
      nome: a.inscricao.user.nomeSocial || a.inscricao.user.nome,
      instituicao: a.inscricao.instituicao.sigla,
      atribuidoEm: a.atribuidoEm,
      ordem: a.ordem,
      rascunho: rascunhos.has(`${a.inscricaoId}|${a.avaliadorId}`),
    });
    porAvaliador.set(a.avaliadorId, g);
  }
  let alvos = [...porAvaliador.values()].sort((x, y) => y.pendentes.length - x.pendentes.length || x.nome.localeCompare(y.nome));

  console.log(`Edição: ${edicao.titulo}`);
  console.log(`Encerramento das avaliações: ${extenso(prazo)} (Brasília) — ${prazo > agora ? `faltam ${duracao(prazo.getTime() - agora.getTime())}` : "JÁ PASSOU"}`);
  console.log(`Avaliações pendentes: ${pend.length} | avaliadores com pendências: ${alvos.length}\n`);
  for (const a of alvos) {
    const maisAntiga = Math.min(...a.pendentes.map((p) => p.atribuidoEm.getTime()));
    console.log(`  ${String(a.pendentes.length).padStart(2)} pendente(s) | mais antiga há ${duracao(agora.getTime() - maisAntiga).padEnd(16)} | ${a.nome} <${a.email}>`);
  }

  const email = new EmailService({ get: (k: string) => process.env[k] } as never);
  const ASSUNTO = "Avaliações pendentes da Fase 2 — OLICMAT";

  if (!alvos.length) {
    console.log("\nNenhum avaliador com pendências. Nada a enviar.");
  } else if (teste) {
    const ex = alvos[0];
    await email.sendMail(teste, `[TESTE] ${ASSUNTO}`, html(ex.nome, ex.pendentes, prazo, agora));
    console.log(`\nE-mail de TESTE (com os dados de ${ex.nome}) enviado para ${teste}.`);
  } else if (!commit) {
    const ex = alvos[0];
    console.log("\n--- Texto do e-mail (exemplo: 1º avaliador da lista) ---");
    console.log(html(ex.nome, ex.pendentes, prazo, agora).replace(/<\/(tr|p|h2)>/g, "\n").replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim());
    console.log("\nSimulação: nada foi enviado. Use --teste <seu e-mail> e depois --commit --actor <adminId>.");
  } else {
    if (!actor) throw new Error("Informe --actor <id do admin>.");
    if (apenasFalhas) {
      if (!existsSync(ARQ_FALHAS)) throw new Error("Não há arquivo de falhas de uma rodada anterior.");
      const f = new Set(JSON.parse(readFileSync(ARQ_FALHAS, "utf-8")) as string[]);
      alvos = alvos.filter((a) => f.has(a.email));
    }
    console.log(`\nEnviando para ${alvos.length} avaliador(es)...`);
    const falhas: string[] = [];
    let enviados = 0;
    for (const a of alvos) {
      try {
        await email.sendMail(a.email, ASSUNTO, html(a.nome, a.pendentes, prazo, agora));
        enviados++;
      } catch (e) {
        falhas.push(a.email);
        console.error(`  FALHA ${a.email}: ${(e as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, 150));
    }
    writeFileSync(ARQ_FALHAS, JSON.stringify(falhas, null, 2));
    await prisma.auditLog.create({
      data: { actorId: actor, acao: "LEMBRETE_AVALIADORES_FASE2", entidade: "Edicao", entidadeId: edicao.id, payload: { prazo: prazo.toISOString(), avaliadores: alvos.length, pendentes: pend.length, enviados, falhas: falhas.length, apenasFalhas } },
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
