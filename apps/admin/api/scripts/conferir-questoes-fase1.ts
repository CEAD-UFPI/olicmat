// Conferência das questões da Fase 1 carregadas em produção.
//
// Somente leitura: imprime as 20 questões (enunciado + alternativas) de forma
// legível e salva as figuras embutidas (base64) como PNGs, para conferir o
// conteúdo contra o TEX/PDF original. Não altera nada no banco.
//
// Uso (a partir de apps/admin/api, com o .env carregado):
//   npx tsx scripts/conferir-questoes-fase1.ts                 # prova Fase 1 mais recente
//   npx tsx scripts/conferir-questoes-fase1.ts --prova <id>    # prova específica

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PROVA_FASE1 = {
  fase: 1,
  status: {
    in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] as ("PUBLICADA" | "EM_ANDAMENTO" | "ENCERRADA")[],
  },
};

const PROVA_MAIS_RECENTE = { publicadaEm: { sort: "desc", nulls: "last" } } as const;

function parseArgs(argv: string[]): { provaId?: string } {
  const o: { provaId?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--prova") o.provaId = argv[++i];
  }
  return o;
}

async function main() {
  const opcoes = parseArgs(process.argv.slice(2));

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL não definido. Rode `source .env` antes.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 5, idleTimeoutMillis: 30000 }),
  });

  try {
    let provaId = opcoes.provaId;
    if (!provaId) {
      const prova = await prisma.prova.findFirst({
        where: PROVA_FASE1,
        orderBy: PROVA_MAIS_RECENTE,
        select: { id: true, titulo: true },
      });
      if (!prova) {
        console.error("Nenhuma prova de Fase 1 (PUBLICADA/EM_ANDAMENTO/ENCERRADA) encontrada.");
        process.exit(1);
      }
      provaId = prova.id;
      console.log(`Prova: ${prova.titulo} (${prova.id})\n`);
    }

    const pqs = await prisma.provaQuestao.findMany({
      where: { provaId },
      orderBy: { ordem: "asc" },
      select: {
        ordem: true,
        questao: {
          select: {
            enunciado: true,
            alternativaA: true,
            alternativaB: true,
            alternativaC: true,
            alternativaD: true,
            alternativaE: true,
            correta: true,
          },
        },
      },
    });

    const FIGURA = /!\[Figura\]\(data:image\/[^;]+;base64,([^)]+)\)/g;
    const dir = join(process.cwd(), "figuras-conferencia");
    mkdirSync(dir, { recursive: true });

    for (const pq of pqs) {
      const q = pq.questao;
      let figura = 0;
      const enunciado = q.enunciado.replace(FIGURA, (_m, b64: string) => {
        figura++;
        const nome = `q${String(pq.ordem).padStart(2, "0")}${figura > 1 ? "-" + figura : ""}.png`;
        writeFileSync(join(dir, nome), Buffer.from(b64, "base64"));
        return `[FIGURA → figuras-conferencia/${nome}]`;
      });

      const gabarito = q.correta ? `gabarito: ${q.correta}` : "sem gabarito";
      console.log(`\n=== Questão ${pq.ordem} (${gabarito}) ===`);
      console.log(enunciado);
      console.log(`A) ${q.alternativaA}`);
      console.log(`B) ${q.alternativaB}`);
      console.log(`C) ${q.alternativaC}`);
      console.log(`D) ${q.alternativaD}`);
      console.log(`E) ${q.alternativaE}`);
    }

    console.log(`\nTotal: ${pqs.length} questões. Figuras extraídas em: ${dir}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
