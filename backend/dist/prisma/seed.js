import { PrismaClient, Role, Eixo, Dificuldade, StatusProva } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
async function main() {
    console.log("Iniciando seed OLICMAT v2.0...");
    const ufpi = await prisma.instituicao.upsert({
        where: { sigla: "UFPI" },
        update: {},
        create: { nome: "Universidade Federal do Piauí", sigla: "UFPI", estado: "PI" },
    });
    const ufma = await prisma.instituicao.upsert({
        where: { sigla: "UFMA" },
        update: {},
        create: { nome: "Universidade Federal do Maranhão", sigla: "UFMA", estado: "MA" },
    });
    const uece = await prisma.instituicao.upsert({
        where: { sigla: "UECE" },
        update: {},
        create: { nome: "Universidade Estadual do Ceará", sigla: "UECE", estado: "CE" },
    });
    const matUfpi = await prisma.curso.upsert({
        where: { nome_instituicaoId: { nome: "Licenciatura em Matemática", instituicaoId: ufpi.id } },
        update: {},
        create: { nome: "Licenciatura em Matemática", instituicaoId: ufpi.id },
    });
    const matUfma = await prisma.curso.upsert({
        where: { nome_instituicaoId: { nome: "Licenciatura em Matemática", instituicaoId: ufma.id } },
        update: {},
        create: { nome: "Licenciatura em Matemática", instituicaoId: ufma.id },
    });
    const matUece = await prisma.curso.upsert({
        where: { nome_instituicaoId: { nome: "Licenciatura em Matemática", instituicaoId: uece.id } },
        update: {},
        create: { nome: "Licenciatura em Matemática", instituicaoId: uece.id },
    });
    const adminHash = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@olicmat.com.br" },
        update: {},
        create: {
            nome: "Prof. Roberto",
            email: "admin@olicmat.com.br",
            cpf: "12345678901",
            senhaHash: adminHash,
            role: Role.ADMIN,
            matricula: "ADM001",
            dataNascimento: new Date("1985-03-15"),
        },
    });
    const coordHash = await bcrypt.hash("coord123", 10);
    const coord = await prisma.user.upsert({
        where: { email: "coord@olicmat.com.br" },
        update: {},
        create: {
            nome: "Prof. Wesley",
            email: "coord@olicmat.com.br",
            cpf: "23456789012",
            senhaHash: coordHash,
            role: Role.COORDENADOR_CURSO,
            instituicaoId: ufpi.id,
            cursoId: matUfpi.id,
            matricula: "COORD001",
            dataNascimento: new Date("1980-07-22"),
        },
    });
    await prisma.coordenadorCurso.upsert({
        where: { userId: coord.id },
        update: {},
        create: { userId: coord.id, cursoId: matUfpi.id },
    });
    const avalHash = await bcrypt.hash("aval123", 10);
    const avaliador = await prisma.user.upsert({
        where: { email: "aval@olicmat.com.br" },
        update: {},
        create: {
            nome: "Dra. Helena",
            email: "aval@olicmat.com.br",
            cpf: "34567890123",
            senhaHash: avalHash,
            role: Role.AVALIADOR,
            matricula: "AVAL001",
            dataNascimento: new Date("1978-11-10"),
        },
    });
    const alunoHash = await bcrypt.hash("aluno123", 10);
    const aluno = await prisma.user.upsert({
        where: { email: "aluno@olicmat.com.br" },
        update: {},
        create: {
            nome: "Lucas Silva",
            email: "aluno@olicmat.com.br",
            cpf: "45678901234",
            senhaHash: alunoHash,
            role: Role.ALUNO,
            instituicaoId: ufpi.id,
            cursoId: matUfpi.id,
            matricula: "2024001",
            dataNascimento: new Date("2002-05-10"),
        },
    });
    const edicao2026 = await prisma.edicao.upsert({
        where: { ano: 2026 },
        update: {},
        create: {
            ano: 2026,
            titulo: "OLICMAT 2026",
            status: "EM_ANDAMENTO",
            dataInicio: new Date("2026-06-01"),
            dataFim: new Date("2026-12-15"),
            pesoFase1: 0.5,
            pesoFase2: 0.5,
        },
    });
    const questoes = await Promise.all([
        prisma.questao.upsert({
            where: { id: "q-00000000-0000-0000-0000-000000000001" },
            update: {},
            create: {
                id: "q-00000000-0000-0000-0000-000000000001",
                enunciado: "Se f(x) = x² - 4x + 3, as raízes da função são:",
                alternativaA: "1 e 3",
                alternativaB: "2 e 2",
                alternativaC: "0 e 4",
                alternativaD: "-1 e -3",
                alternativaE: "1 e 4",
                correta: "A",
                eixo: Eixo.ALGEBRA,
                dificuldade: Dificuldade.FACIL,
                createdBy: avaliador.id,
            },
        }),
        prisma.questao.upsert({
            where: { id: "q-00000000-0000-0000-0000-000000000002" },
            update: {},
            create: {
                id: "q-00000000-0000-0000-0000-000000000002",
                enunciado: "Em um triângulo retângulo de catetos 3 e 4, a hipotenusa mede:",
                alternativaA: "6",
                alternativaB: "7",
                alternativaC: "5",
                alternativaD: "4",
                alternativaE: "8",
                correta: "C",
                eixo: Eixo.GEOMETRIA,
                dificuldade: Dificuldade.FACIL,
                createdBy: avaliador.id,
            },
        }),
        prisma.questao.upsert({
            where: { id: "q-00000000-0000-0000-0000-000000000003" },
            update: {},
            create: {
                id: "q-00000000-0000-0000-0000-000000000003",
                enunciado: "O limite de (x² - 1)/(x - 1) quando x tende a 1 é:",
                alternativaA: "0",
                alternativaB: "1",
                alternativaC: "2",
                alternativaD: "Não existe",
                alternativaE: "Infinito",
                correta: "C",
                eixo: Eixo.ANALISE,
                dificuldade: Dificuldade.MEDIO,
                createdBy: avaliador.id,
            },
        }),
        prisma.questao.upsert({
            where: { id: "q-00000000-0000-0000-0000-000000000004" },
            update: {},
            create: {
                id: "q-00000000-0000-0000-0000-000000000004",
                enunciado: "Em uma distribuição normal padrão, a área entre -1 e 1 desvios padrão da média é aproximadamente:",
                alternativaA: "50%",
                alternativaB: "68%",
                alternativaC: "95%",
                alternativaD: "99%",
                alternativaE: "75%",
                correta: "B",
                eixo: Eixo.ESTATISTICA,
                dificuldade: Dificuldade.MEDIO,
                createdBy: avaliador.id,
            },
        }),
        prisma.questao.upsert({
            where: { id: "q-00000000-0000-0000-0000-000000000005" },
            update: {},
            create: {
                id: "q-00000000-0000-0000-0000-000000000005",
                enunciado: "A transposição didática, conceito fundamental na didática da matemática, foi proposto por:",
                alternativaA: "Jean Piaget",
                alternativaB: "Lev Vygotsky",
                alternativaC: "Yves Chevallard",
                alternativaD: "Paulo Freire",
                alternativaE: "David Ausubel",
                correta: "C",
                eixo: Eixo.DIDATICA,
                dificuldade: Dificuldade.DIFICIL,
                createdBy: avaliador.id,
            },
        }),
    ]);
    const prova = await prisma.prova.upsert({
        where: { id: "prova-0000-0000-0000-000000000001" },
        update: {},
        create: {
            id: "prova-0000-0000-0000-000000000001",
            edicaoId: edicao2026.id,
            fase: 1,
            titulo: "Prova Objetiva — Fase 1",
            duracaoMinutos: 180,
            status: StatusProva.RASCUNHO,
            versao: 1,
            createdBy: avaliador.id,
        },
    });
    for (let i = 0; i < questoes.length; i++) {
        await prisma.provaQuestao.upsert({
            where: { provaId_questaoId: { provaId: prova.id, questaoId: questoes[i].id } },
            update: {},
            create: {
                provaId: prova.id,
                questaoId: questoes[i].id,
                ordem: i + 1,
            },
        });
    }
    await prisma.inscricao.upsert({
        where: { userId: aluno.id },
        update: {},
        create: {
            userId: aluno.id,
            edicaoId: edicao2026.id,
            status: "CONFIRMADA",
            estado: "PI",
            municipio: "Teresina",
            instituicaoId: ufpi.id,
            cursoId: matUfpi.id,
            periodo: 5,
        },
    });
    const inscricaoAluno = await prisma.inscricao.findUniqueOrThrow({ where: { userId: aluno.id } });
    await prisma.envioFase2.upsert({
        where: { id: "envio-0000-0000-0000-000000000001" },
        update: {},
        create: {
            id: "envio-0000-0000-0000-000000000001",
            inscricaoId: inscricaoAluno.id,
            tipo: "VIDEO",
            arquivoUrl: "https://exemplo.com/videoaula-olimat.mp4",
            status: "ENVIADO",
        },
    });
    await prisma.envioFase2.upsert({
        where: { id: "envio-0000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "envio-0000-0000-0000-000000000002",
            inscricaoId: inscricaoAluno.id,
            tipo: "PORTFOLIO",
            arquivoUrl: "https://exemplo.com/portfolio-olimat.pdf",
            status: "ENVIADO",
        },
    });
    await prisma.auditLog.createMany({
        data: [
            {
                actorId: admin.id,
                acao: "LOGIN",
                entidade: "Auth",
                entidadeId: admin.id,
                payload: { ip: "127.0.0.1" },
            },
            {
                actorId: admin.id,
                acao: "CREATE",
                entidade: "Inscricao",
                entidadeId: inscricaoAluno.id,
                payload: { status: "CONFIRMADA", userId: aluno.id },
            },
            {
                actorId: admin.id,
                acao: "UPDATE",
                entidade: "Prova",
                entidadeId: "prova-0000-0000-0000-000000000001",
                payload: { status: "PUBLICADA", questoes: 5 },
            },
        ],
        skipDuplicates: true,
    });
    console.log("Seed OLICMAT v2.0 concluído com sucesso!");
    console.log("\n--- Usuários de teste ---");
    console.log("Admin:       admin@olicmat.com.br / admin123");
    console.log("Coordenador: coord@olicmat.com.br / coord123");
    console.log("Avaliador:   aval@olicmat.com.br / aval123");
    console.log("Aluno:       aluno@olicmat.com.br / aluno123");
    console.log(`\nProva: ${prova.id} — ${questoes.length} questões`);
}
main()
    .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map