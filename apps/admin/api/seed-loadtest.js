import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: 'postgresql://olicmat:olicmat_dev@localhost:5433/olicmat',
});
const prisma = new PrismaClient({ adapter });

const NUM_USERS = 100;
const PASSWORD = 'loadtest123';

async function seed() {
  console.log('🌱 Seeding load test data...');

  let edicao = await prisma.edicao.findFirst({ orderBy: { ano: 'desc' } });
  if (!edicao) {
    edicao = await prisma.edicao.create({
      data: { ano: 2026, titulo: '1ª OLICMAT', status: 'ATIVA' },
    });
    console.log(`✅ Created edicao: ${edicao.id}`);
  }

  let instituicao = await prisma.instituicao.findFirst();
  if (!instituicao) {
    instituicao = await prisma.instituicao.create({
      data: { nome: 'UFPI', sigla: 'UFPI', codigoInep: '12345678', uf: 'PI' },
    });
    console.log(`✅ Created instituicao: ${instituicao.id}`);
  }

  let curso = await prisma.curso.findFirst({ where: { instituicaoId: instituicao.id } });
  if (!curso) {
    curso = await prisma.curso.create({
      data: { nome: 'Licenciatura em Matemática', instituicaoId: instituicao.id },
    });
    console.log(`✅ Created curso: ${curso.id}`);
  }

  let prova = await prisma.prova.findFirst({ where: { edicaoId: edicao.id, fase: 1 } });
  if (!prova) {
    prova = await prisma.prova.create({
      data: { titulo: 'Prova Fase 1 - Load Test', edicaoId: edicao.id, fase: 1, duracaoMinutos: 180 },
    });
    console.log(`✅ Created prova: ${prova.id}`);
  }

  let questoes = await prisma.questao.findMany({ take: 30 });
  if (questoes.length < 30) {
    for (let i = questoes.length; i < 30; i++) {
      const q = await prisma.questao.create({
        data: {
          enunciado: `Questão load test #${i + 1}. Quanto é ${i + 1} + ${i + 1}?`,
          alternativaA: `${(i + 1) * 2}`,
          alternativaB: `${(i + 1) * 3}`,
          alternativaC: `${(i + 1) + 1}`,
          alternativaD: `${(i + 1) * 4}`,
          alternativaE: `${i + 1}`,
          correta: 'A',
          eixo: 'ALGEBRA',
          dificuldade: 'FACIL',
        },
      });
      questoes.push(q);
    }
    console.log(`✅ Created ${30 - questoes.length} questions`);
  }

  const existingLinks = await prisma.provaQuestao.findMany({ where: { provaId: prova.id } });
  if (existingLinks.length < 30) {
    const linkedIds = new Set(existingLinks.map(l => l.questaoId));
    for (let i = 0; i < 30; i++) {
      if (!linkedIds.has(questoes[i].id)) {
        await prisma.provaQuestao.create({
          data: { provaId: prova.id, questaoId: questoes[i].id, ordem: i + 1 },
        });
      }
    }
    console.log(`✅ Linked questions to prova`);
  }

  const startFrom = 0;
  const senhaHash = await bcrypt.hash(PASSWORD, 10);

  console.log(`Creating ${NUM_USERS} test users...`);

  for (let i = startFrom; i < startFrom + NUM_USERS; i++) {
    const email = `loadtest${i}@olicmat.com`;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) continue;

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

    if ((i + 1) % 20 === 0) console.log(`✅ Created ${i + 1 - startFrom} users...`);
  }

  console.log(`\n📊 Users: ${await prisma.user.count()} | Inscrições: ${await prisma.inscricao.count()}`);
  console.log(`🔑 Password: ${PASSWORD}`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
