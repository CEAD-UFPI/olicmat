/**
 * Prova de demonstração para apresentações (lives, tutoriais, treinamentos).
 *
 * Cria, SOMENTE no banco local, tudo o que é preciso para mostrar a Fase 1 do
 * ponto de vista do participante, sem tocar na prova nem nos candidatos reais:
 *
 *   - uma edição à parte ("DEMONSTRAÇÃO", encerrada, para não virar a edição ativa);
 *   - um aluno de teste com inscrição CONFIRMADA nessa edição;
 *   - uma prova de Fase 1 com 6 questões inéditas, escritas só para a demonstração
 *     (não reproduzem nenhuma questão da prova oficial).
 *
 * É idempotente: rodar de novo ZERA a tentativa do aluno de teste (respostas,
 * início, fim e nota) e reabre a janela da prova — use antes de cada demonstração.
 *
 * Como rodar (a partir de apps/admin/api, com o banco do docker-compose no ar):
 *   npx tsx --env-file=.env prisma/seed-prova-demo.ts
 *
 * Acesso do aluno de teste (painel do participante, http://localhost:3006):
 *   e-mail: demo.prova@olicmat.local   senha: Demo@2026
 *
 * Trava de segurança: o script se recusa a rodar se DATABASE_URL não apontar
 * para a própria máquina. Nunca deve criar dados de teste em produção.
 */
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const DEMO_EMAIL = "demo.prova@olicmat.local";
const DEMO_SENHA = "Demo@2026";
const DEMO_CPF = "99999999999";
const DEMO_EDICAO = { ano: 2025, semestre: 1 };
const DEMO_PROVA_ID = "prova-demo-0000-0000-000000000001";
const DEMO_AUTOR = "demo-seed";
const DURACAO_MINUTOS = 45;

function exigirBancoLocal(url: string | undefined): string {
  if (!url) throw new Error("DATABASE_URL não definida.");
  const host = new URL(url).hostname;
  if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(host)) {
    throw new Error(
      `Recusado: DATABASE_URL aponta para "${host}". Este script só roda em banco local.`,
    );
  }
  return url;
}

const adapter = new PrismaPg({
  connectionString: exigirBancoLocal(process.env.DATABASE_URL),
});
const prisma = new PrismaClient({ adapter });

type Eixo = "ALGEBRA" | "GEOMETRIA" | "ANALISE" | "ESTATISTICA" | "DIDATICA";
type Dificuldade = "FACIL" | "MEDIO" | "DIFICIL";

interface QuestaoDemo {
  eixo: Eixo;
  dificuldade: Dificuldade;
  enunciado: string;
  /** A..E; `correta` indica a letra certa na ordem canônica. */
  alternativas: [string, string, string, string, string];
  correta: "A" | "B" | "C" | "D" | "E";
}

const QUESTOES: QuestaoDemo[] = [
  {
    eixo: "ALGEBRA",
    dificuldade: "FACIL",
    enunciado:
      "Questão de demonstração. As fórmulas aparecem formatadas, como na prova real.\n\nQual é a solução da equação $2x + 6 = 14$?",
    alternativas: ["$x = 2$", "$x = 3$", "$x = 4$", "$x = 8$", "$x = 10$"],
    correta: "C",
  },
  {
    eixo: "GEOMETRIA",
    dificuldade: "FACIL",
    enunciado:
      "Um triângulo retângulo tem catetos de medidas $3$ cm e $4$ cm. Qual é a medida da hipotenusa?",
    alternativas: ["$5$ cm", "$6$ cm", "$7$ cm", "$\\sqrt{7}$ cm", "$12$ cm"],
    correta: "A",
  },
  {
    eixo: "ANALISE",
    dificuldade: "MEDIO",
    enunciado: "Qual é a derivada da função $f(x) = x^3 + 2x$?",
    alternativas: [
      "$3x^2$",
      "$x^2 + 2$",
      "$3x^2 + 2$",
      "$3x + 2$",
      "$x^4/4 + x^2$",
    ],
    correta: "C",
  },
  {
    eixo: "ESTATISTICA",
    dificuldade: "FACIL",
    enunciado:
      "As notas de cinco estudantes em um teste foram $6$, $7$, $8$, $9$ e $10$. Qual é a média aritmética dessas notas?",
    alternativas: ["$7$", "$7{,}5$", "$8$", "$8{,}5$", "$9$"],
    correta: "C",
  },
  {
    eixo: "DIDATICA",
    dificuldade: "MEDIO",
    enunciado:
      "Ao ensinar frações, um professor pede que os estudantes dobrem uma folha de papel em partes iguais e pintem algumas delas. Do ponto de vista didático, o principal objetivo dessa atividade é:",
    alternativas: [
      "memorizar a regra de simplificação de frações;",
      "associar a representação simbólica da fração a uma situação concreta de partição;",
      "avaliar a habilidade de dobradura dos estudantes;",
      "substituir a necessidade de discutir o conceito de unidade;",
      "treinar apenas o cálculo mental de adição de frações.",
    ],
    correta: "B",
  },
  {
    eixo: "ALGEBRA",
    dificuldade: "MEDIO",
    enunciado:
      "Última questão da demonstração. Quantas raízes reais distintas tem a equação $x^2 - 5x + 6 = 0$?",
    alternativas: [
      "Nenhuma",
      "Uma",
      "Duas",
      "Três",
      "Infinitas",
    ],
    correta: "C",
  },
];

async function main() {
  // Curso e instituição reaproveitados do cadastro local (apenas leitura).
  const curso = await prisma.curso.findFirst({
    orderBy: { nome: "asc" },
    select: { id: true, instituicaoId: true },
  });
  if (!curso) {
    throw new Error(
      "Nenhum curso cadastrado no banco local. Rode o seed principal antes (prisma db seed).",
    );
  }

  const edicao = await prisma.edicao.upsert({
    where: { ano_semestre: DEMO_EDICAO },
    update: {},
    create: {
      ...DEMO_EDICAO,
      titulo: "DEMONSTRAÇÃO — Prova de Teste",
      status: "ENCERRADA",
    },
  });

  const aluno = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { senhaHash: await bcrypt.hash(DEMO_SENHA, 10), emailConfirmado: true },
    create: {
      nome: "Participante Demonstração",
      email: DEMO_EMAIL,
      cpf: DEMO_CPF,
      senhaHash: await bcrypt.hash(DEMO_SENHA, 10),
      role: Role.ALUNO,
      emailConfirmado: true,
      instituicaoId: curso.instituicaoId,
      cursoId: curso.id,
      matricula: "DEMO0001",
      dataNascimento: new Date("2000-01-01"),
    },
  });

  // Inscrição confirmada e "zerada": volta ao estado de quem ainda não começou.
  const inscricao = await prisma.inscricao.upsert({
    where: { userId_edicaoId: { userId: aluno.id, edicaoId: edicao.id } },
    update: {
      status: "CONFIRMADA",
      fase1Inicio: null,
      fase1Fim: null,
      fase1Nota: null,
      fase1TempoExtraMinutos: 0,
    },
    create: {
      userId: aluno.id,
      edicaoId: edicao.id,
      status: "CONFIRMADA",
      estado: "PI",
      municipio: "Teresina",
      instituicaoId: curso.instituicaoId,
      cursoId: curso.id,
      periodo: 8,
    },
  });
  await prisma.resposta.deleteMany({ where: { inscricaoId: inscricao.id } });

  // Prova e questões de demonstração (recriadas a cada execução).
  await prisma.questao.deleteMany({ where: { createdBy: DEMO_AUTOR } });
  const agora = Date.now();
  const dia = 24 * 60 * 60 * 1000;
  const prova = await prisma.prova.upsert({
    where: { id: DEMO_PROVA_ID },
    update: {
      status: "EM_ANDAMENTO",
      duracaoMinutos: DURACAO_MINUTOS,
      janelaInicio: new Date(agora - dia),
      janelaFim: new Date(agora + 7 * dia),
    },
    create: {
      id: DEMO_PROVA_ID,
      edicaoId: edicao.id,
      fase: 1,
      titulo: "Prova de Demonstração — Fase 1",
      duracaoMinutos: DURACAO_MINUTOS,
      status: "EM_ANDAMENTO",
      publicadaEm: new Date(),
      janelaInicio: new Date(agora - dia),
      janelaFim: new Date(agora + 7 * dia),
      createdBy: aluno.id,
    },
  });

  for (const [i, q] of QUESTOES.entries()) {
    const [a, b, c, d, e] = q.alternativas;
    const criada = await prisma.questao.create({
      data: {
        enunciado: q.enunciado,
        alternativaA: a,
        alternativaB: b,
        alternativaC: c,
        alternativaD: d,
        alternativaE: e,
        correta: q.correta,
        eixo: q.eixo,
        dificuldade: q.dificuldade,
        createdBy: DEMO_AUTOR,
      },
    });
    await prisma.provaQuestao.create({
      data: { provaId: prova.id, questaoId: criada.id, ordem: i + 1 },
    });
  }

  console.log("Prova de demonstração pronta.");
  console.log(`  Edição:   ${edicao.titulo} (${DEMO_EDICAO.ano}/${DEMO_EDICAO.semestre})`);
  console.log(`  Prova:    ${prova.titulo} — ${QUESTOES.length} questões, ${DURACAO_MINUTOS} min`);
  console.log(`  Login:    ${DEMO_EMAIL}  /  ${DEMO_SENHA}`);
  console.log("  Painel:   http://localhost:3006  →  Fase 1 → Ir para a prova");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
