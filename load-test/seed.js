/**
 * OLICMAT Load Test - Seed Script
 * Creates test users with confirmed inscriptions for load testing.
 * Run: node load-test/seed.js
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  datasources: [{ url: 'postgresql://olicmat:olicmat_dev@localhost:5433/olicmat' }],
});

const NUM_USERS = 100;
const PASSWORD = 'loadtest123';

async function seed() {
  console.log('🌱 Seeding load test data...');

  // Get or create edicao
  let edicao = await prisma.edicao.findFirst({ orderBy: { ano: 'desc' } });
  if (!edicao) {
    edicao = await prisma.edicao.create({
      data: {
        ano: 2026,
        titulo: '1ª OLICMAT',
        status: 'ATIVA',
      },
    });
    console.log(`✅ Created edicao: ${edicao.id}`);
  }

  // Get or create instituicao
  let instituicao = await prisma.instituicao.findFirst();
  if (!instituicao) {
    instituicao = await prisma.instituicao.create({
      data: {
        nome: 'Universidade Federal do Piauí',
        sigla: 'UFPI',
        codigoInep: '12345678',
        uf: 'PI',
      },
    });
    console.log(`✅ Created instituicao: ${instituicao.id}`);
  }

  // Get or create curso
  let curso = await prisma.curso.findFirst({ where: { instituicaoId: instituicao.id } });
  if (!curso) {
    curso = await prisma.curso.create({
      data: {
        nome: 'Licenciatura em Matemática',
        instituicaoId: instituicao.id,
      },
    });
    console.log(`✅ Created curso: ${curso.id}`);
  }

  // Get or create prova
  let prova = await prisma.prova.findFirst({ where: { edicaoId: edicao.id, fase: 1 } });
  if (!prova) {
    prova = await prisma.prova.create({
      data: {
        titulo: 'Prova Fase 1 - Load Test',
        edicaoId: edicao.id,
        fase: 1,
        duracaoMinutos: 180,
      },
    });
    console.log(`✅ Created prova: ${prova.id}`);
  }

  // Get or create questoes
  let questoes = await prisma.questao.findMany({ take: 30 });
  if (questoes.length < 30) {
    console.log(`Creating ${30 - questoes.length} additional questions...`);
    for (let i = questoes.length; i < 30; i++) {
      const q = await prisma.questao.create({
        data: {
          enunciado: `Questão de load test #${i + 1}. Qual é o resultado de ${i + 1} + ${i + 1}?`,
          alternativaA: `${(i + 1) * 2}`,
          alternativaB: `${(i + 1) * 3}`,
          alternativaC: `${(i + 1) + 1}`,
          alternativaD: `${(i + 1) * 4}`,
          alternativaE: `${i + 1}`,
          correta: 'A',
          eixo: 'Álgebra',
          dificuldade: 'FACIL',
        },
      });
      questoes.push(q);
    }
    console.log(`✅ Created ${30 - questoes.length} questions`);
  }

  // Link questoes to prova via ProvaQuestao
  const existingLinks = await prisma.provaQuestao.findMany({ where: { provaId: prova.id } });
  if (existingLinks.length < 30) {
    const linkedIds = new Set(existingLinks.map(l => l.questaoId));
    for (let i = 0; i < 30; i++) {
      if (!linkedIds.has(questoes[i].id)) {
        await prisma.provaQuestao.create({
          data: {
            provaId: prova.id,
            questaoId: questoes[i].id,
            ordem: i + 1,
          },
        });
      }
    }
    console.log(`✅ Linked ${30 - existingLinks.length} questions to prova`);
  }

  // Create test users with inscriptions
  const existingUsers = await prisma.user.count();
  const startFrom = existingUsers;

  console.log(`Creating ${NUM_USERS} test users (starting from #${startFrom + 1})...`);

  const senhaHash = await bcrypt.hash(PASSWORD, 10);

  for (let i = startFrom; i < startFrom + NUM_USERS; i++) {
    const email = `loadtest${i}@olicmat.com`;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`⏭️  User ${email} already exists`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        nome: `Load Test User ${i}`,
        email,
        cpf: `${String(i).padStart(11, '0')}`,
        senhaHash,
        role: 'ALUNO',
        instituicaoId: instituicao.id,
        cursoId: curso.id,
        matricula: `MAT${String(i).padStart(6, '0')}`,
        dataNascimento: new Date('2000-01-01'),
        telefone: '86999999999',
        genero: 'MASCULINO',
        racaCor: 'BRANCA',
      },
    });

    await prisma.inscricao.create({
      data: {
        userId: user.id,
        edicaoId: edicao.id,
        instituicaoId: instituicao.id,
        cursoId: curso.id,
        status: 'CONFIRMADA',
        estado: 'PI',
      },
    });

    if ((i + 1) % 20 === 0) {
      console.log(`✅ Created ${i + 1 - startFrom} users...`);
    }
  }

  const totalUsers = await prisma.user.count();
  const totalInscricoes = await prisma.inscricao.count();
  console.log(`\n📊 Final counts:`);
  console.log(`   Users: ${totalUsers}`);
  console.log(`   Inscrições: ${totalInscricoes}`);
  console.log(`   Questões: ${questoes.length}`);
  console.log(`   Provas: 1`);
  console.log(`\n🔑 Login credentials:`);
  console.log(`   Email: loadtest<N>@olicmat.com`);
  console.log(`   Password: ${PASSWORD}`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
