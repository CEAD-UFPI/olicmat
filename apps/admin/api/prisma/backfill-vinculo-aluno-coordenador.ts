/**
 * Preenche User.coordenadorId e Convite.criadoPorId a partir dos convites já
 * aceitos, ligando cada aluno ao coordenador que o convidou.
 *
 * Antes desta mudança o vínculo só existia via Convite.criadoPor (e-mail de quem
 * convidou) e o User não guardava quem o convidou. Sem o backfill, alunos
 * convidados antes da mudança sumiriam da visão de seus coordenadores, porque os
 * novos filtros da coordenação usam User.coordenadorId.
 *
 * Idempotente: só grava quando o valor difere do esperado. Modo seguro (padrão):
 * apenas relata o que mudaria.
 *   npx tsx prisma/backfill-vinculo-aluno-coordenador.ts
 *
 * Aplicar:
 *   npx tsx prisma/backfill-vinculo-aluno-coordenador.ts --aplicar
 */
import { PrismaClient, Role } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function backfill(aplicar: boolean) {
  const convites = await prisma.convite.findMany({
    where: { usadoEm: { not: null }, criadoPor: { not: "" } },
    select: {
      id: true,
      email: true,
      role: true,
      criadoPor: true,
      criadoPorId: true,
    },
  });

  let criadoPorId = 0;
  let vinculados = 0;
  let semCriador = 0;
  let semAluno = 0;
  const ignorados: string[] = [];

  for (const convite of convites) {
    const criador = await prisma.user.findUnique({
      where: { email: convite.criadoPor.toLowerCase() },
      select: { id: true },
    });
    if (!criador) {
      semCriador++;
      ignorados.push(`${convite.email} (criador ${convite.criadoPor} sem cadastro)`);
      continue;
    }

    if (convite.criadoPorId !== criador.id) {
      if (aplicar) {
        await prisma.convite.update({
          where: { id: convite.id },
          data: { criadoPorId: criador.id },
        });
      }
      criadoPorId++;
    }

    if (convite.role !== Role.ALUNO) {
      continue;
    }

    const aluno = await prisma.user.findUnique({
      where: { email: convite.email.toLowerCase() },
      select: { id: true, role: true, coordenadorId: true },
    });
    if (!aluno || aluno.role !== Role.ALUNO) {
      semAluno++;
      ignorados.push(`${convite.email} (aluno não encontrado)`);
      continue;
    }

    if (aluno.coordenadorId !== criador.id) {
      if (aplicar) {
        await prisma.user.update({
          where: { id: aluno.id },
          data: { coordenadorId: criador.id },
        });
      }
      vinculados++;
    }
  }

  console.log();
  console.log(`Convites aceitos processados: ${convites.length}`);
  console.log(`  criadoPorId a preencher:      ${criadoPorId}`);
  console.log(`  alunos a vincular:            ${vinculados}`);
  console.log(`  sem criador resolvido:        ${semCriador}`);
  console.log(`  sem aluno resolvido:          ${semAluno}`);
  if (ignorados.length) {
    console.log("\nSem correspondência:");
    for (const linha of ignorados) console.log(`  ${linha}`);
  }
  console.log();
  console.log(aplicar ? "Mudanças aplicadas." : "Modo seco — execute com --aplicar para gravar.");
  console.log();
}

async function main() {
  const [primeiro] = process.argv.slice(2);
  await backfill(primeiro === "--aplicar");
}

main()
  .catch((e) => {
    console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
