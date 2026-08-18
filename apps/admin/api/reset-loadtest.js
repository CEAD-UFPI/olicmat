import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: 'postgresql://olicmat:olicmat_dev@localhost:5433/olicmat' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({ where: { email: { startsWith: 'loadtest' } }, take: 100 });
  const edicao = await prisma.edicao.findFirst({ orderBy: { ano: 'desc' } });
  const instituicao = await prisma.instituicao.findFirst();
  const curso = await prisma.curso.findFirst();
  const questao = await prisma.questao.findFirst();

  console.log('Users:', users.length);
  console.log('First questaoId:', questao?.id);

  for (const user of users) {
    await prisma.inscricao.deleteMany({ where: { userId: user.id } });
    await prisma.resposta.deleteMany({ where: { inscricao: { userId: user.id } } });
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
  }

  console.log('✅ Fresh inscricoes created for', users.length, 'users');
  console.log('📝 QuestaoId para teste:', questao?.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
