// Verificação (SOMENTE LEITURA) da relação de classificados para a Fase 2:
// por instituição, a menor nota entre os classificados e quem concluiu a prova
// com nota igual ou maior e ficou de fora (possível omissão).
//
// Uso (dentro do container admin-api): npx tsx scripts/verificar-classificacao-fase1.ts
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
  if (!edicao) throw new Error("Nenhuma edição.");
  const todas = await prisma.inscricao.findMany({
    where: { edicaoId: edicao.id },
    select: {
      numero: true, status: true, fase1Fim: true, fase1Nota: true, fase2Classificado: true,
      user: { select: { nome: true, dataNascimento: true } },
      instituicao: { select: { sigla: true } },
    },
  });
  const porInst = new Map<string, typeof todas>();
  for (const i of todas) porInst.set(i.instituicao.sigla, [...(porInst.get(i.instituicao.sigla) ?? []), i]);

  let suspeitos = 0;
  console.log(`Edição: ${edicao.titulo}\n`);
  for (const [sigla, lista] of [...porInst.entries()].sort()) {
    const concluintes = lista.filter((i) => i.fase1Fim && i.fase1Nota != null);
    const classif = lista.filter((i) => i.fase2Classificado);
    if (!classif.length && !concluintes.length) continue;
    const notasClassif = classif.filter((i) => i.fase1Nota != null).map((i) => i.fase1Nota as number);
    const menor = notasClassif.length ? Math.min(...notasClassif) : null;
    const fora = concluintes
      .filter((i) => !i.fase2Classificado && menor != null && (i.fase1Nota as number) >= menor)
      .sort((a, b) => (b.fase1Nota as number) - (a.fase1Nota as number));
    const semNota = classif.filter((i) => i.fase1Nota == null);
    console.log(`${sigla}: ${concluintes.length} concluíram | ${classif.length} classificados | menor nota classificada: ${menor ?? "—"}`);
    if (semNota.length) console.log(`  ATENÇÃO: ${semNota.length} classificado(s) sem nota da Fase 1: ${semNota.map((i) => `nº ${i.numero} ${i.user.nome}`).join("; ")}`);
    for (const i of fora) {
      suspeitos++;
      const empate = i.fase1Nota === menor ? " (EMPATE com a menor nota; ver critério de desempate)" : "";
      console.log(`  FORA DA LISTA: nº ${i.numero} | ${i.user.nome} | nota ${i.fase1Nota} | inscrição ${i.status} | nasc. ${i.user.dataNascimento.toISOString().slice(0, 10)}${empate}`);
    }
  }
  console.log(`\nTotal de possíveis omissões: ${suspeitos}.`);
} catch (e) {
  console.error("ERRO:", (e as Error).message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
