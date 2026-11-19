// Prorroga o prazo da Fase 2 e (opcional) libera um novo envio de cada arquivo
// para todos os classificados (exceção ao envio único; cada liberação vale um envio).
//
// Uso (dentro do container admin-api):
//   npx tsx scripts/prorrogar-fase2.ts --prazo 2026-11-20T12:00:00-03:00 --liberar-reenvio            # simulação
//   npx tsx scripts/prorrogar-fase2.ts --prazo 2026-11-20T12:00:00-03:00 --liberar-reenvio --commit --actor <adminId>
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const argv = process.argv.slice(2);
const valor = (n: string) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const commit = argv.includes("--commit");
const liberar = argv.includes("--liberar-reenvio");
const actor = valor("--actor");
const prazoTxt = valor("--prazo");
const fmt = (d: Date | null) => (d ? d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) + " (Brasília)" : "—");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  if (!prazoTxt || !/[+-]\d\d:\d\d$|Z$/.test(prazoTxt)) throw new Error("Informe --prazo com fuso, ex.: 2026-11-20T12:00:00-03:00");
  const prazo = new Date(prazoTxt);
  if (Number.isNaN(prazo.getTime())) throw new Error("Prazo inválido.");
  if (prazo.getTime() <= Date.now()) throw new Error("O novo prazo precisa estar no futuro.");

  const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
  if (!edicao?.fase2InicioEm) throw new Error("A Fase 2 ainda não foi iniciada.");
  const distribuidas = await prisma.atribuicaoFase2.count({ where: { inscricao: { edicaoId: edicao.id } } });
  if (distribuidas) throw new Error(`Já há ${distribuidas} atribuições aos avaliadores; não é seguro reabrir o envio.`);

  const classificados = await prisma.inscricao.findMany({
    where: { edicaoId: edicao.id, fase2Classificado: true },
    select: { id: true, enviosFase2: { orderBy: { enviadoEm: "desc" }, take: 1, select: { videoKey: true, portfolioKey: true } } },
  });
  let completos = 0, soVideo = 0, soPortfolio = 0, nada = 0;
  for (const c of classificados) {
    const e = c.enviosFase2[0];
    if (e?.videoKey && e?.portfolioKey) completos++;
    else if (e?.videoKey) soVideo++;
    else if (e?.portfolioKey) soPortfolio++;
    else nada++;
  }
  console.log(`Edição: ${edicao.titulo}`);
  console.log(`Competência: ${edicao.fase2Tema}`);
  console.log(`Início: ${fmt(edicao.fase2InicioEm)}`);
  console.log(`Prazo atual: ${fmt(edicao.fase2PrazoEm)}  →  NOVO PRAZO: ${fmt(prazo)}`);
  console.log(`Classificados: ${classificados.length} | completos: ${completos} | só vídeo: ${soVideo} | só portfólio: ${soPortfolio} | nenhum arquivo: ${nada}`);
  console.log(liberar ? `Liberação de reenvio: TODOS os ${classificados.length} poderão enviar mais uma vez a videoaula e o portfólio.` : "Liberação de reenvio: não (só prorroga).");

  if (!commit) {
    console.log("\nSimulação: nada foi gravado. Repita com --commit --actor <adminId>.");
  } else {
    if (!actor) throw new Error("Informe --actor <id do admin>.");
    await prisma.$transaction([
      prisma.edicao.update({ where: { id: edicao.id }, data: { fase2PrazoEm: prazo } }),
      ...(liberar
        ? [prisma.inscricao.updateMany({ where: { edicaoId: edicao.id, fase2Classificado: true }, data: { fase2ReenvioVideo: true, fase2ReenvioPortfolio: true } })]
        : []),
      prisma.auditLog.create({
        data: {
          actorId: actor,
          acao: "PRORROGAR_FASE2",
          entidade: "Edicao",
          entidadeId: edicao.id,
          payload: { prazoAnterior: edicao.fase2PrazoEm?.toISOString() ?? null, novoPrazo: prazo.toISOString(), liberarReenvioTodos: liberar, classificados: classificados.length },
        },
      }),
    ]);
    const atual = await prisma.edicao.findUnique({ where: { id: edicao.id }, select: { fase2PrazoEm: true } });
    console.log(`\nGravado. Prazo agora: ${fmt(atual!.fase2PrazoEm)}`);
  }
} catch (e) {
  console.error("ERRO:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
