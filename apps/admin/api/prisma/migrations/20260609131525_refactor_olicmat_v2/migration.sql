-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ALUNO', 'COORDENADOR_CURSO', 'AVALIADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusInsc" AS ENUM ('PENDENTE', 'CONFIRMADA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "StatusProva" AS ENUM ('RASCUNHO', 'PUBLICADA', 'EM_ANDAMENTO', 'ENCERRADA');

-- CreateEnum
CREATE TYPE "Medalha" AS ENUM ('OURO', 'PRATA', 'BRONZE');

-- CreateEnum
CREATE TYPE "Eixo" AS ENUM ('ALGEBRA', 'GEOMETRIA', 'ANALISE', 'ESTATISTICA', 'DIDATICA');

-- CreateEnum
CREATE TYPE "Dificuldade" AS ENUM ('FACIL', 'MEDIO', 'DIFICIL');

-- CreateEnum
CREATE TYPE "StatusEnvioFase2" AS ENUM ('PENDENTE', 'ENVIADO', 'AVALIADO');

-- CreateTable
CREATE TABLE "Instituicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "instituicaoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ALUNO',
    "instituicaoId" TEXT,
    "cursoId" TEXT,
    "matricula" TEXT NOT NULL,
    "comprovanteUrl" TEXT,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordenadorCurso" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,

    CONSTRAINT "CoordenadorCurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edicao" (
    "id" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANEJAMENTO',
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "pesoFase1" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "pesoFase2" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "edicaoId" TEXT NOT NULL,
    "status" "StatusInsc" NOT NULL DEFAULT 'PENDENTE',
    "estado" TEXT NOT NULL,
    "municipio" TEXT,
    "instituicaoId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "periodo" INTEGER,
    "comprovanteUrl" TEXT,
    "fase1Nota" DOUBLE PRECISION,
    "fase1Inicio" TIMESTAMP(3),
    "fase1Fim" TIMESTAMP(3),
    "fase2Tema" TEXT,
    "notaFinal" DOUBLE PRECISION,
    "medalha" "Medalha",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prova" (
    "id" TEXT NOT NULL,
    "edicaoId" TEXT NOT NULL,
    "fase" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL,
    "status" "StatusProva" NOT NULL DEFAULT 'RASCUNHO',
    "publicadaEm" TIMESTAMP(3),
    "janelaInicio" TIMESTAMP(3),
    "janelaFim" TIMESTAMP(3),
    "versao" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questao" (
    "id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativaA" TEXT NOT NULL,
    "alternativaB" TEXT NOT NULL,
    "alternativaC" TEXT NOT NULL,
    "alternativaD" TEXT NOT NULL,
    "alternativaE" TEXT NOT NULL,
    "correta" TEXT NOT NULL,
    "eixo" "Eixo" NOT NULL,
    "dificuldade" "Dificuldade" NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProvaQuestao" (
    "id" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "ProvaQuestao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "alternativaMarcada" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvioFase2" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "arquivoUrl" TEXT NOT NULL,
    "status" "StatusEnvioFase2" NOT NULL DEFAULT 'PENDENTE',
    "enviadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvioFase2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliacaoFase2" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "parecer" TEXT,
    "avaliadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvaliacaoFase2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingSnapshot" (
    "id" TEXT NOT NULL,
    "edicaoId" TEXT NOT NULL,
    "estado" TEXT,
    "dados" JSONB NOT NULL,
    "publicadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instituicao_sigla_key" ON "Instituicao"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nome_instituicaoId_key" ON "Curso"("nome", "instituicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "CoordenadorCurso_userId_key" ON "CoordenadorCurso"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Edicao_ano_key" ON "Edicao"("ano");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_userId_key" ON "Inscricao"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_userId_edicaoId_key" ON "Inscricao"("userId", "edicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaQuestao_provaId_questaoId_key" ON "ProvaQuestao"("provaId", "questaoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaQuestao_provaId_ordem_key" ON "ProvaQuestao"("provaId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_inscricaoId_provaId_questaoId_key" ON "Resposta"("inscricaoId", "provaId", "questaoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoFase2_inscricaoId_avaliadorId_key" ON "AvaliacaoFase2"("inscricaoId", "avaliadorId");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordenadorCurso" ADD CONSTRAINT "CoordenadorCurso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordenadorCurso" ADD CONSTRAINT "CoordenadorCurso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "Edicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prova" ADD CONSTRAINT "Prova_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "Edicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaQuestao" ADD CONSTRAINT "ProvaQuestao_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaQuestao" ADD CONSTRAINT "ProvaQuestao_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvioFase2" ADD CONSTRAINT "EnvioFase2_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoFase2" ADD CONSTRAINT "AvaliacaoFase2_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoFase2" ADD CONSTRAINT "AvaliacaoFase2_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
