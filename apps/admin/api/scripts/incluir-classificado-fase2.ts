// Inclui participante(s) na relação de classificados da Fase 2 (correção de
// omissão) e envia o e-mail de início da Fase 2 com a competência e o prazo atual.
//
// Uso (dentro do container admin-api):
//   npx tsx scripts/incluir-classificado-fase2.ts --numeros 89                       # simulação
//   npx tsx scripts/incluir-classificado-fase2.ts --numeros 89,123 --motivo "Omissão na relação oficial" --commit --actor <adminId>
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { EmailService } from "../dist/src/email/email.service.js";

const argv = process.argv.slice(2);
const valor = (n: string) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const commit = argv.includes("--commit");
const actor = valor("--actor");
const motivo = valor("--motivo") ?? "";
const numeros = (valor("--numeros") ?? "").split(",").map((x) => Number(x.trim())).filter((n) => Number.isInteger(n) && n > 0);
const fmt = (d: Date | null) => (d ? d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) + " (Brasília)" : "—");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  if (!numeros.length) throw new Error("Informe --numeros com o nº da inscrição (ex.: --numeros 89).");
  const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
  if (!edicao) throw new Error("Nenhuma edição.");
  const alvos = await prisma.inscricao.findMany({
    where: { edicaoId: edicao.id, numero: { in: numeros } },
    select: { id: true, numero: true, status: true, fase1Fim: true, fase1Nota: true, fase2Classificado: true, user: { select: { nome: true, nomeSocial: true, email: true } }, instituicao: { select: { sigla: true } } },
  });
  const faltando = numeros.filter((n) => !alvos.some((a) => a.numero === n));
  if (faltando.length) throw new Error(`Inscrição(ões) não encontrada(s) nesta edição: ${faltando.join(", ")}`);

  console.log(`Edição: ${edicao.titulo}`);
  console.log(`Fase 2: ${edicao.fase2InicioEm ? `iniciada em ${fmt(edicao.fase2InicioEm)}, prazo ${fmt(edicao.fase2PrazoEm)}` : "ainda não iniciada"}`);
  for (const a of alvos) {
    console.log(`- nº ${a.numero} | ${a.user.nome} | ${a.instituicao.sigla} | nota F1 ${a.fase1Nota ?? "—"} | inscrição ${a.status} | já classificado: ${a.fase2Classificado ? "SIM" : "não"}`);
    if (a.status !== "CONFIRMADA" || !a.fase1Fim) console.log("  ATENÇÃO: inscrição não confirmada ou prova não concluída.");
  }
  const novos = alvos.filter((a) => !a.fase2Classificado);
  if (!commit) {
    console.log(`\nSimulação: ${novos.length} seriam incluído(s) e receberiam o e-mail de início da Fase 2. Nada foi gravado.`);
    console.log('Para gravar: --motivo "..." --commit --actor <adminId>');
  } else {
    if (!actor) throw new Error("Informe --actor <id do admin>.");
    if (motivo.trim().length < 5) throw new Error('Informe --motivo "..." (mínimo 5 caracteres).');
    if (!novos.length) throw new Error("Todos já estão classificados.");
    await prisma.$transaction([
      prisma.inscricao.updateMany({ where: { id: { in: novos.map((a) => a.id) } }, data: { fase2Classificado: true } }),
      ...novos.map((a) => prisma.auditLog.create({
        data: { actorId: actor, acao: "INCLUIR_CLASSIFICADO_FASE2", entidade: "Inscricao", entidadeId: a.id, payload: { numero: a.numero, nome: a.user.nome, instituicao: a.instituicao.sigla, fase1Nota: a.fase1Nota, motivo } },
      })),
    ]);
    console.log(`\nGravado: ${novos.length} incluído(s) na relação de classificados.`);
    const total = await prisma.inscricao.count({ where: { edicaoId: edicao.id, fase2Classificado: true } });
    console.log(`Classificados para a Fase 2 agora: ${total}.`);

    if (edicao.fase2InicioEm && edicao.fase2PrazoEm && edicao.fase2Tema && edicao.fase2PrazoEm.getTime() > Date.now()) {
      const email = new EmailService({ get: (k: string) => process.env[k] } as never);
      for (const a of novos) {
        const nome = a.user.nomeSocial || a.user.nome;
        let status = "ENVIADO", erro: string | null = null;
        try { await email.enviarInicioFase2(a.user.email, nome, edicao.fase2Tema, edicao.fase2InicioEm, edicao.fase2PrazoEm); }
        catch (e) { status = "FALHA"; erro = (e as Error).message.slice(0, 500); }
        await prisma.emailFase2.upsert({
          where: { inscricaoId: a.id },
          create: { inscricaoId: a.id, email: a.user.email, status, erro, tentativas: 1 },
          update: { email: a.user.email, status, erro, tentativas: { increment: 1 } },
        });
        console.log(`E-mail de início da Fase 2 para ${a.user.email}: ${status}${erro ? ` (${erro})` : ""}`);
      }
    } else {
      console.log("E-mail não enviado: a Fase 2 não está aberta.");
    }
  }
} catch (e) {
  console.error("ERRO:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
