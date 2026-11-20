// Diagnóstico (SOMENTE LEITURA) da Fase 1 de um participante: inscrição, prova,
// nota gravada, acertos recalculados questão a questão (com o mesmo
// embaralhamento do exam-app) e posição na instituição.
//
// Uso (dentro do container admin-api):
//   npx tsx scripts/diagnosticar-fase1.ts "nome do participante"
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { montarRevisao } from "../dist/src/olimpiada/revisao-fase1/revisao-fase1.logic.js";

const busca = process.argv.slice(2).join(" ").trim();
const sem = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const fmt = (d: Date | null) => (d ? d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "—");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  if (busca.length < 3) throw new Error('Informe parte do nome: npx tsx scripts/diagnosticar-fase1.ts "nome"');
  const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
  if (!edicao) throw new Error("Nenhuma edição.");

  const partes = sem(busca).split(/\s+/);
  const todas = await prisma.inscricao.findMany({
    where: { edicaoId: edicao.id },
    select: {
      id: true, numero: true, status: true, instituicaoId: true,
      fase1Inicio: true, fase1Fim: true, fase1Nota: true, fase1FimMotivo: true, fase1Advertencias: true, fase2Classificado: true,
      user: { select: { nome: true, email: true, dataNascimento: true } },
      instituicao: { select: { sigla: true } },
      curso: { select: { nome: true } },
    },
  });
  const achados = todas.filter((i) => partes.every((p) => sem(i.user.nome).includes(p)));
  if (!achados.length) {
    console.log(`Nenhuma inscrição na edição "${edicao.titulo}" com nome contendo: ${busca}`);
  }

  const prova = await prisma.prova.findFirst({
    where: { edicaoId: edicao.id, fase: 1, status: { in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] } },
    orderBy: { publicadaEm: { sort: "desc", nulls: "last" } },
    select: {
      id: true, titulo: true,
      questoes: { orderBy: { ordem: "asc" }, select: { ordem: true, questao: { select: { id: true, enunciado: true, correta: true, alternativaA: true, alternativaB: true, alternativaC: true, alternativaD: true, alternativaE: true } } } },
    },
  });
  if (!prova) throw new Error("Prova da Fase 1 não encontrada.");
  const questoes = prova.questoes.map((pq) => ({ ...pq.questao, ordem: pq.ordem }));

  for (const i of achados) {
    console.log("\n==================================================================");
    console.log(`${i.user.nome} | nº ${i.numero} | ${i.instituicao.sigla} | ${i.curso.nome}`);
    console.log(`E-mail: ${i.user.email} | Nascimento: ${i.user.dataNascimento.toISOString().slice(0, 10)}`);
    console.log(`Inscrição: ${i.status} | Classificado(a) para a Fase 2: ${i.fase2Classificado ? "SIM" : "NÃO"}`);
    console.log(`Prova: início ${fmt(i.fase1Inicio)} | fim ${fmt(i.fase1Fim)} | motivo do fim: ${i.fase1FimMotivo ?? "—"} | advertências: ${i.fase1Advertencias}`);

    const respostas = await prisma.resposta.findMany({
      where: { inscricaoId: i.id, questaoId: { in: questoes.map((q) => q.id) } },
      select: { questaoId: true, alternativaMarcada: true, correta: true },
    });
    const gravadas = respostas.filter((r) => r.correta).length;
    const r = montarRevisao(i.id, questoes, new Map(respostas.map((x) => [x.questaoId, x.alternativaMarcada])));
    console.log(`Nota gravada: ${i.fase1Nota ?? "—"} | respostas registradas: ${respostas.length} de ${questoes.length}`);
    console.log(`Acertos gravados: ${gravadas} | acertos recalculados agora: ${r.acertos} → nota ${Math.round((r.acertos / r.total) * 10000) / 100}`);
    console.log("\nQuestão | letra que ELE viu e marcou | letra correta NA ORDEM DELE | gabarito oficial (ordem original) | resultado");
    for (const [k, it] of r.itens.entries()) {
      console.log(`  ${String(it.numero).padStart(2)}    | ${(it.marcada ?? "—").padEnd(26)} | ${it.correta.padEnd(27)} | ${String(questoes[k].correta).padEnd(33)} | ${it.acertou ? "ACERTOU" : it.marcada ? "errou" : "em branco"}`);
    }
    console.log("(As alternativas são embaralhadas por participante: a letra correta na ordem dele difere da letra do gabarito oficial.)");

    // Posição na instituição entre os que concluíram a prova (regra: 50% por instituição, arredondado para cima; desempate: maior idade).
    const pares = todas
      .filter((x) => x.instituicaoId === i.instituicaoId && x.fase1Fim && x.fase1Nota != null)
      .sort((a, b) => (b.fase1Nota! - a.fase1Nota!) || (a.user.dataNascimento.getTime() - b.user.dataNascimento.getTime()));
    const vagas = Math.ceil(pares.length / 2);
    const pos = pares.findIndex((x) => x.id === i.id) + 1;
    const classif = todas.filter((x) => x.instituicaoId === i.instituicaoId && x.fase2Classificado);
    const menor = classif.length ? Math.min(...classif.map((x) => x.fase1Nota ?? Infinity)) : null;
    console.log(`\n${i.instituicao.sigla}: ${pares.length} concluíram a prova (50% para cima seria ${vagas}) | classificados marcados no sistema: ${classif.length}`);
    console.log(`Posição dele(a) por nota: ${pos ? `${pos}º de ${pares.length}` : "fora do ranking (prova não concluída ou sem nota)"} | menor nota entre os classificados da instituição: ${menor ?? "—"}`);
  }
} catch (e) {
  console.error("ERRO:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
