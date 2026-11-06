// Correção pós-prova da Fase 1.
//
// O gabarito oficial chega DEPOIS da prova, por segurança. Enquanto não existe
// (Questao.correta = null), a finalização deixa fase1Nota vazia e grava toda
// Resposta.correta = false. Este script, depois do gabarito preenchido,
// reconstrói a letra canônica de cada resposta (revertendo o embaralhamento
// determinístico) e recalcula as notas — sem reexpor nada ao participante.
//
// Uso (a partir de apps/admin/api, com o .env carregado):
//   source .env
//   npx tsx scripts/corrigir-fase1.ts --edicao <id>                  # simulação
//   npx tsx scripts/corrigir-fase1.ts --edicao <id> --commit         # grava
//   npx tsx scripts/corrigir-fase1.ts --edicao <id> --commit --actor <adminId>

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { estaCorreta, calcularNota } from "./corrigir-fase1.logic.js";

const PROVA_FASE1 = {
  fase: 1,
  status: {
    in: ["PUBLICADA", "EM_ANDAMENTO", "ENCERRADA"] as ("PUBLICADA" | "EM_ANDAMENTO" | "ENCERRADA")[],
  },
};

const PROVA_MAIS_RECENTE = { publicadaEm: { sort: "desc", nulls: "last" } } as const;

interface Opcoes {
  edicaoId?: string;
  commit: boolean;
  actor?: string;
}

function parseArgs(argv: string[]): Opcoes {
  const o: Opcoes = { commit: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--edicao") o.edicaoId = argv[++i];
    else if (argv[i] === "--commit") o.commit = true;
    else if (argv[i] === "--actor") o.actor = argv[++i];
  }
  return o;
}

async function main() {
  const opcoes = parseArgs(process.argv.slice(2));

  if (!opcoes.edicaoId) {
    console.error("Informe a edição com --edicao <id>. Use --commit para gravar.");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL não definido. Rode `source .env` antes.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 5, idleTimeoutMillis: 30000 }),
  });

  try {
    const prova = await prisma.prova.findFirst({
      where: { edicaoId: opcoes.edicaoId, ...PROVA_FASE1 },
      orderBy: PROVA_MAIS_RECENTE,
      select: { id: true, titulo: true },
    });

    if (!prova) {
      console.error(`Nenhuma prova de Fase 1 encontrada na edição ${opcoes.edicaoId}.`);
      process.exit(1);
    }

    // Guarda dura: gabarito incompleto → nada é alterado.
    const semGabarito = await prisma.questao.findMany({
      where: { correta: null, provas: { some: { provaId: prova.id } } },
      select: { id: true },
    });

    if (semGabarito.length > 0) {
      console.error(
        `GABARITO INCOMPLETO: ${semGabarito.length} questão(ões) sem resposta correta na prova ${prova.id}.`,
      );
      console.error(`Questões sem gabarito: ${semGabarito.map((q) => q.id).join(", ")}`);
      console.error("Nada foi alterado. Preencha o gabarito e rode novamente.");
      process.exit(2);
    }

    const provasQuestoes = await prisma.provaQuestao.findMany({
      where: { provaId: prova.id },
      select: { questao: { select: { id: true, correta: true } } },
    });
    const gabarito = new Map(provasQuestoes.map((pq) => [pq.questao.id, pq.questao.correta]));
    const totalQuestoes = provasQuestoes.length;

    // Só quem finalizou (fase1Fim != null), espelhando finalizarProva.
    const inscricoes = await prisma.inscricao.findMany({
      where: { edicaoId: opcoes.edicaoId, status: "CONFIRMADA", fase1Fim: { not: null } },
      select: { id: true, fase1Nota: true },
      orderBy: { id: "asc" },
    });

    console.log(
      [
        `Prova: ${prova.titulo ?? prova.id}`,
        `Questões: ${totalQuestoes}`,
        `Inscrições finalizadas: ${inscricoes.length}`,
        `Modo: ${opcoes.commit ? "COMMIT" : "DRY-RUN"}`,
      ].join(" · "),
    );

    let flips = 0; // respostas que viram corretas
    let notasAlteradas = 0;
    const resumo: string[] = [];

    for (const inscricao of inscricoes) {
      const respostas = await prisma.resposta.findMany({
        where: { inscricaoId: inscricao.id },
        select: { id: true, questaoId: true, alternativaMarcada: true, correta: true },
      });

      let corretas = 0;
      const mudancas: { id: string; correta: boolean }[] = [];

      for (const r of respostas) {
        const correta = estaCorreta(
          inscricao.id,
          r.questaoId,
          r.alternativaMarcada,
          gabarito.get(r.questaoId) ?? null,
        );
        if (correta) corretas++;
        if (correta !== r.correta) {
          mudancas.push({ id: r.id, correta });
          if (correta) flips++;
        }
      }

      const nota = calcularNota(corretas, totalQuestoes);
      resumo.push(`${inscricao.id}\t${corretas}/${totalQuestoes}\t${nota}`);

      if (opcoes.commit) {
        await prisma.$transaction(async (tx) => {
          for (const m of mudancas) {
            await tx.resposta.update({ where: { id: m.id }, data: { correta: m.correta } });
          }
          if (nota !== inscricao.fase1Nota) {
            notasAlteradas++;
            await tx.inscricao.update({ where: { id: inscricao.id }, data: { fase1Nota: nota } });
          }
        });
      }
    }

    if (opcoes.commit) {
      let actorId = opcoes.actor;
      if (!actorId) {
        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
        if (!admin) {
          console.error("Nenhum ADMIN encontrado para a auditoria; use --actor <userId>.");
          process.exit(1);
        }
        actorId = admin.id;
      }

      await prisma.auditLog.create({
        data: {
          actorId,
          acao: "CORRIGIR_FASE1",
          entidade: "Edicao",
          entidadeId: opcoes.edicaoId,
          payload: { provaId: prova.id, inscricoes: inscricoes.length, notasAlteradas, flips },
        },
      });

      console.log(`Correção gravada: ${notasAlteradas} nota(s) alterada(s), ${flips} resposta(s) corretas.`);
      console.log("Registro de auditoria criado.");
    } else {
      console.log("Prévia (nada foi gravado):");
      console.log(`inscricaoId\tcorretas\tnota`);
      console.log(resumo.join("\n"));
      console.log("Reexecute com --commit para gravar.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
