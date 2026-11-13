// Carrega a relação oficial de classificados para a Fase 2 (Inscricao.fase2Classificado).
//
// A fonte é scripts/classificados-fase2-2026.json, extraído da relação retificada
// publicada em 12/11/2026 (182 nomes, por instituição). Cada nome é localizado
// entre as inscrições CONFIRMADAS da edição, na mesma instituição, comparando o
// nome sem acentos e sem diferença de maiúsculas. O script só grava se TODOS os
// nomes forem encontrados exatamente uma vez.
//
// Uso (dentro do container admin-api, ou em apps/admin/api com o .env carregado):
//   npx tsx scripts/importar-classificados-fase2.ts                    # simulação
//   npx tsx scripts/importar-classificados-fase2.ts --commit --actor <adminId>

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export function normalizarNome(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function args(argv: string[]) {
  const o: { commit: boolean; actor?: string; arquivo?: string } = { commit: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--commit") o.commit = true;
    else if (argv[i] === "--actor") o.actor = argv[++i];
    else if (argv[i] === "--arquivo") o.arquivo = argv[++i];
  }
  return o;
}

async function main() {
  const o = args(process.argv.slice(2));
  const aqui = dirname(fileURLToPath(import.meta.url));
  const arquivo = o.arquivo ?? join(aqui, "classificados-fase2-2026.json");
  const lista = JSON.parse(readFileSync(arquivo, "utf-8")) as Record<string, string[]>;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL não definido.");
    process.exit(1);
  }
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const edicao = await prisma.edicao.findFirst({ orderBy: [{ ano: "desc" }, { semestre: "desc" }] });
    if (!edicao) throw new Error("Nenhuma edição cadastrada");
    console.log(`Edição: ${edicao.titulo} (${edicao.id})`);

    const inscricoes = await prisma.inscricao.findMany({
      where: { edicaoId: edicao.id, status: "CONFIRMADA" },
      select: {
        id: true,
        numero: true,
        fase2Classificado: true,
        user: { select: { nome: true } },
        instituicao: { select: { sigla: true } },
      },
    });

    const porChave = new Map<string, typeof inscricoes>();
    for (const i of inscricoes) {
      const k = `${i.instituicao.sigla.toUpperCase()}|${normalizarNome(i.user.nome)}`;
      porChave.set(k, [...(porChave.get(k) ?? []), i]);
    }

    const ids: string[] = [];
    const problemas: string[] = [];
    let total = 0;
    for (const [sigla, nomes] of Object.entries(lista)) {
      for (const nome of nomes) {
        total++;
        const achados = porChave.get(`${sigla.toUpperCase()}|${normalizarNome(nome)}`) ?? [];
        if (achados.length === 1) ids.push(achados[0].id);
        else problemas.push(`${sigla} | ${nome}: ${achados.length === 0 ? "NÃO ENCONTRADO" : `${achados.length} inscrições com esse nome`}`);
      }
    }
    if (new Set(ids).size !== ids.length) problemas.push("Uma mesma inscrição corresponde a dois nomes da lista.");

    console.log(`Nomes na lista: ${total} | localizados: ${ids.length}`);
    for (const [sigla, nomes] of Object.entries(lista)) console.log(`  ${sigla}: ${nomes.length}`);
    if (problemas.length) {
      console.error("\nNada foi gravado. Resolva os nomes abaixo:");
      for (const p of problemas) console.error("  - " + p);
      process.exit(2);
    }

    const jaMarcados = inscricoes.filter((i) => i.fase2Classificado).length;
    console.log(`Já marcados hoje: ${jaMarcados}`);
    if (!o.commit) {
      console.log("\nSimulação OK. Rode com --commit --actor <adminId> para gravar.");
      return;
    }
    if (!o.actor) {
      console.error("Informe --actor <id do admin> para registrar a auditoria.");
      process.exit(1);
    }

    await prisma.$transaction([
      prisma.inscricao.updateMany({
        where: { edicaoId: edicao.id, fase2Classificado: true, id: { notIn: ids } },
        data: { fase2Classificado: false },
      }),
      prisma.inscricao.updateMany({ where: { id: { in: ids } }, data: { fase2Classificado: true } }),
      prisma.auditLog.create({
        data: {
          actorId: o.actor,
          acao: "IMPORTAR_CLASSIFICADOS_FASE2",
          entidade: "Edicao",
          entidadeId: edicao.id,
          payload: { total: ids.length, porInstituicao: Object.fromEntries(Object.entries(lista).map(([k, v]) => [k, v.length])) },
        },
      }),
    ]);
    const marcados = await prisma.inscricao.count({ where: { edicaoId: edicao.id, fase2Classificado: true } });
    console.log(`\nGravado. Classificados para a Fase 2 na edição: ${marcados}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
