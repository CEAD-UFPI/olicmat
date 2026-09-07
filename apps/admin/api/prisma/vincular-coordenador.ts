/**
 * Vincula um coordenador já cadastrado ao curso que ele coordena.
 *
 * Necessário para quem aceitou o convite antes de a tela passar a pedir
 * instituição e curso: o papel COORDENADOR_CURSO ficou correto, mas sem a
 * linha em CoordenadorCurso o painel filtra por uma lista vazia de cursos e
 * não mostra aluno nenhum.
 *
 * Listar os cursos disponíveis:
 *   docker exec olicmat-admin-api npx tsx prisma/vincular-coordenador.ts --listar
 *
 * Diagnosticar quem está sem vínculo:
 *   docker exec olicmat-admin-api npx tsx prisma/vincular-coordenador.ts --coordenadores
 *
 * Recriar os vínculos faltantes a partir do curso já gravado no perfil:
 *   docker exec olicmat-admin-api npx tsx prisma/vincular-coordenador.ts --sincronizar
 *
 * Vincular um caso específico:
 *   docker exec olicmat-admin-api npx tsx prisma/vincular-coordenador.ts fulano@ifpi.edu.br <cursoId>
 */
import { PrismaClient, Role } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function listar() {
  const instituicoes = await prisma.instituicao.findMany({
    include: { cursos: { select: { id: true, nome: true } } },
    orderBy: { nome: "asc" },
  });

  for (const inst of instituicoes) {
    console.log(`\n${inst.sigla ?? ""} ${inst.nome}`.trim());
    if (!inst.cursos.length) {
      console.log("    (sem cursos cadastrados)");
    }
    for (const curso of inst.cursos) {
      console.log(`    ${curso.id}  ${curso.nome}`);
    }
  }
  console.log();
}

/**
 * O painel administrativo exibe o curso a partir de User.cursoId, mas o painel
 * do coordenador filtra por CoordenadorCurso. Enquanto os dois não coincidem, o
 * admin vê o curso preenchido e jura que está tudo certo, enquanto o
 * coordenador entra e não encontra aluno nenhum. Esta listagem mostra os dois
 * lados na mesma linha justamente para acabar com esse mal-entendido.
 */
async function coordenadores() {
  const usuarios = await prisma.user.findMany({
    where: { role: Role.COORDENADOR_CURSO },
    select: {
      nome: true,
      email: true,
      curso: {
        select: { id: true, nome: true, instituicao: { select: { sigla: true } } },
      },
      coordenadorias: { select: { cursoId: true } },
    },
    orderBy: { nome: "asc" },
  });

  if (!usuarios.length) {
    console.log("\nNenhum usuário com papel COORDENADOR_CURSO.\n");
    return usuarios;
  }

  console.log();
  for (const u of usuarios) {
    const perfil = u.curso
      ? `${u.curso.instituicao?.sigla ?? "?"} · ${u.curso.nome}`
      : "SEM CURSO NO PERFIL";
    const vinculo = u.coordenadorias[0];
    const estado = !vinculo
      ? "VINCULO AUSENTE"
      : u.curso && vinculo.cursoId !== u.curso.id
        ? "VINCULO DIVERGENTE"
        : "ok";
    console.log(`${estado.padEnd(18)} ${u.email.padEnd(34)} ${perfil}`);
  }
  console.log();

  return usuarios;
}

/**
 * Reconstrói os vínculos faltantes usando o curso já gravado no perfil. Só
 * escreve onde falta ou onde diverge; não inventa curso para quem está sem.
 */
async function sincronizar() {
  const usuarios = await coordenadores();

  const pendentes = usuarios.filter((u) => {
    if (!u.curso) return false;
    const vinculo = u.coordenadorias[0];
    return !vinculo || vinculo.cursoId !== u.curso.id;
  });

  const semCurso = usuarios.filter((u) => !u.curso);

  if (!pendentes.length) {
    console.log("Nada a corrigir: todos os vínculos batem com o perfil.\n");
  }

  for (const u of pendentes) {
    const user = await prisma.user.findUnique({
      where: { email: u.email },
      select: { id: true },
    });
    if (!user) continue;
    await prisma.coordenadorCurso.upsert({
      where: { userId: user.id },
      update: { cursoId: u.curso!.id },
      create: { userId: user.id, cursoId: u.curso!.id },
    });
    console.log(`Corrigido: ${u.email} → ${u.curso!.nome}`);
  }

  if (semCurso.length) {
    console.log(
      `\n${semCurso.length} coordenador(es) sem curso no perfil — ` +
        `preencha no painel ou use <email> <cursoId>:`,
    );
    for (const u of semCurso) console.log(`    ${u.email}`);
  }
  console.log();
}

async function vincular(email: string, cursoId: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, nome: true, email: true, role: true },
  });
  if (!user) {
    throw new Error(`Nenhum usuário com o e-mail ${email}.`);
  }
  if (user.role !== Role.COORDENADOR_CURSO) {
    throw new Error(
      `${email} tem papel ${user.role}, não COORDENADOR_CURSO. ` +
        `Ajuste o papel antes de vincular a um curso.`,
    );
  }

  const curso = await prisma.curso.findUnique({
    where: { id: cursoId },
    select: { id: true, nome: true, instituicaoId: true },
  });
  if (!curso) {
    throw new Error(`Curso ${cursoId} não encontrado. Use --listar.`);
  }

  // Usuário e vínculo precisam mudar juntos: o painel lê CoordenadorCurso,
  // mas o perfil exibe instituicaoId/cursoId. Divergir confunde o suporte.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { cursoId: curso.id, instituicaoId: curso.instituicaoId },
    }),
    prisma.coordenadorCurso.upsert({
      where: { userId: user.id },
      update: { cursoId: curso.id },
      create: { userId: user.id, cursoId: curso.id },
    }),
  ]);

  console.log(`Vinculado: ${user.nome} <${user.email}> → ${curso.nome}`);
}

async function main() {
  const [primeiro, segundo] = process.argv.slice(2);

  if (primeiro === "--coordenadores") {
    await coordenadores();
    return;
  }

  if (primeiro === "--sincronizar") {
    await sincronizar();
    return;
  }

  if (!primeiro || primeiro === "--listar") {
    await listar();
    if (!primeiro) {
      console.log(
        "Para vincular: npx tsx prisma/vincular-coordenador.ts <email> <cursoId>\n",
      );
    }
    return;
  }

  if (!segundo) {
    throw new Error(
      "Informe o cursoId. Veja os disponíveis com --listar.",
    );
  }

  await vincular(primeiro, segundo);
}

main()
  .catch((e) => {
    console.error(`\nFalhou: ${e instanceof Error ? e.message : e}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
