// Substituição integral das questões da Fase 1 (OLICMAT 2026-10).
//
// A prova já publicada (status PUBLICADA) bloqueia qualquer mutação de questão
// pelo admin-api, então a troca é feita por este script standalone, direto no
// banco. Ele apaga TODAS as questões atuais da prova da Fase 1 e recria as 20
// novas a partir de `questoes-fase1-2026-10.ts`, SEM gabarito — `Questao.correta`
// permanece NULL por segurança (o gabarito oficial só entra depois da prova).
//
// As figuras (q09/q10/q12/q13) já vêm embutidas como base64 no próprio módulo
// de questões — nada é lido de disco, então o script funciona em qualquer lugar
// que alcance o banco (container, host, outra máquina).
//
// Uso (a partir de apps/admin/api, com o .env carregado):
//   npx tsx scripts/substituir-questoes-fase1.ts                  # simulação
//   npx tsx scripts/substituir-questoes-fase1.ts --commit         # grava
//   npx tsx scripts/substituir-questoes-fase1.ts --commit --actor <adminId>

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { QUESTOES_FASE1_2026_10 } from "./questoes-fase1-2026-10.js";

const PROVA_FASE1 = {
  fase: 1,
  status: {
    in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] as ("PUBLICADA" | "EM_ANDAMENTO" | "ENCERRADA")[],
  },
};

const PROVA_MAIS_RECENTE = { publicadaEm: { sort: "desc", nulls: "last" } } as const;

interface Opcoes {
  commit: boolean;
  actor?: string;
}

function parseArgs(argv: string[]): Opcoes {
  const o: Opcoes = { commit: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--commit") o.commit = true;
    else if (argv[i] === "--actor") o.actor = argv[++i];
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
    // Localiza automaticamente a prova de Fase 1 mais recente publicada.
    const prova = await prisma.prova.findFirst({
      where: PROVA_FASE1,
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true, titulo: true, status: true, edicaoId: true },
    });

    if (!prova) {
      console.error("Nenhuma prova de Fase 1 (PUBLICADA/EM_ANDAMENTO/ENCERRADA) encontrada.");
      process.exit(1);
    }

    // Guarda dura 1: só trocamos uma prova ainda PUBLICADA. Depois de começar
    // (EM_ANDAMENTO) ou terminar (ENCERRADA), substituir questões corromperia
    // as respostas dos participantes.
    if (prova.status !== "PUBLICADA") {
      console.error(
        `Prova ${prova.id} ("${prova.titulo ?? ""}") está com status ${prova.status}, não PUBLICADA.`,
      );
      console.error("Substituir questões agora é proibido: participantes já podem ter respondido.");
      console.error("Nada foi alterado.");
      process.exit(2);
    }

    // Guarda dura 2: nenhuma resposta registrada para esta prova.
    const totalRespostas = await prisma.resposta.count({ where: { provaId: prova.id } });
    if (totalRespostas > 0) {
      console.error(`Existem ${totalRespostas} resposta(s) registrada(s) para a prova ${prova.id}.`);
      console.error("Substituir as questões invalidaria essas respostas. Nada foi alterado.");
      process.exit(3);
    }

    // Guarda dura 3: o gabarito NÃO pode vir preenchido no payload.
    for (const q of QUESTOES_FASE1_2026_10) {
      const correta = (q as unknown as { correta?: string }).correta;
      if (correta != null) {
        console.error(`Questão ${q.ordem} trouxe correta "${correta}". O gabarito só entra depois da prova.`);
        console.error("Nada foi alterado.");
        process.exit(4);
      }
    }

    const antigas = await prisma.provaQuestao.findMany({
      where: { provaId: prova.id },
      select: { questaoId: true },
    });

    console.log(
      [
        `Prova: ${prova.titulo ?? prova.id} (${prova.id})`,
        `Edição: ${prova.edicaoId}`,
        `Status: ${prova.status}`,
        `Questões atuais: ${antigas.length}`,
        `Questões novas: ${QUESTOES_FASE1_2026_10.length}`,
        `Modo: ${opcoes.commit ? "COMMIT" : "DRY-RUN"}`,
      ].join("\n"),
    );

    // Prévia do enunciado da primeira questão, só no dry-run.
    if (!opcoes.commit) {
      const exemplo = QUESTOES_FASE1_2026_10[0];
      console.log("\n--- Prévia (questão 1) ---");
      console.log(exemplo.enunciado);
      console.log("---------------------------");
      console.log("Reexecute com --commit para gravar.");
      return;
    }

    let actorId = opcoes.actor;
    if (!actorId) {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
      if (!admin) {
        console.error("Nenhum ADMIN encontrado para a auditoria; use --actor <userId>.");
        process.exit(1);
      }
      actorId = admin.id;
    }

    const criadas = await prisma.$transaction(async (tx) => {
      // Desvincula e remove as questões antigas (não há respostas — guarda 2).
      await tx.provaQuestao.deleteMany({ where: { provaId: prova.id } });
      await tx.questao.deleteMany({ where: { id: { in: antigas.map((p) => p.questaoId) } } });

      let contador = 0;
      for (const q of QUESTOES_FASE1_2026_10) {
        const nova = await tx.questao.create({
          data: {
            enunciado: q.enunciado,
            alternativaA: q.alternativaA,
            alternativaB: q.alternativaB,
            alternativaC: q.alternativaC,
            alternativaD: q.alternativaD,
            alternativaE: q.alternativaE,
            correta: null,
            createdBy: actorId,
          },
        });
        await tx.provaQuestao.create({
          data: { provaId: prova.id, questaoId: nova.id, ordem: q.ordem },
        });
        contador++;
      }

      return contador;
    });

    await prisma.auditLog.create({
      data: {
        actorId,
        acao: "SUBSTITUIR_QUESTOES_FASE1",
        entidade: "Prova",
        entidadeId: prova.id,
        payload: {
          edicaoId: prova.edicaoId,
          removidas: antigas.length,
          criadas,
          figurasEmbutidas: ["q09", "q10", "q12", "q13"],
        },
      },
    });

    console.log(
      `Substituição concluída: ${antigas.length} questão(ões) removida(s), ${criadas} criada(s) (sem gabarito).`,
    );
    console.log("Registro de auditoria criado.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
