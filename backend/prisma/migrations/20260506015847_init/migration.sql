-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ALUNO', 'AVALIADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusInsc" AS ENUM ('PENDENTE', 'CONFIRMADA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "Medalha" AS ENUM ('OURO', 'PRATA', 'BRONZE');

-- CreateEnum
CREATE TYPE "Eixo" AS ENUM ('ALGEBRA', 'GEOMETRIA', 'ANALISE', 'ESTATISTICA', 'DIDATICA');

-- CreateEnum
CREATE TYPE "Dificuldade" AS ENUM ('FACIL', 'MEDIO', 'DIFICIL');

-- CreateEnum
CREATE TYPE "TipoSubm" AS ENUM ('ARTIGO', 'POSTER');

-- CreateEnum
CREATE TYPE "StatusSubm" AS ENUM ('EM_AVALIACAO', 'APROVADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ALUNO',
    "instituicao" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "comprovanteUrl" TEXT,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "StatusInsc" NOT NULL DEFAULT 'PENDENTE',
    "estado" TEXT NOT NULL,
    "municipio" TEXT,
    "instituicao" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "periodo" INTEGER,
    "comprovanteUrl" TEXT,
    "fase1Nota" DOUBLE PRECISION,
    "fase1Inicio" TIMESTAMP(3),
    "fase1Fim" TIMESTAMP(3),
    "fase2Tema" TEXT,
    "fase2VideoUrl" TEXT,
    "fase2PortfolioUrl" TEXT,
    "fase2Nota" DOUBLE PRECISION,
    "notaFinal" DOUBLE PRECISION,
    "medalha" "Medalha",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "alternativa" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "conteudos" JSONB NOT NULL,
    "questionario" JSONB,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoCurso" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "concluido" BOOLEAN NOT NULL DEFAULT false,
    "nota" DOUBLE PRECISION,

    CONSTRAINT "ProgressoCurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "emitidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submissao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" "TipoSubm" NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "arquivoUrl" TEXT NOT NULL,
    "status" "StatusSubm" NOT NULL DEFAULT 'EM_AVALIACAO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submissao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_userId_key" ON "Inscricao"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_inscricaoId_questaoId_key" ON "Resposta"("inscricaoId", "questaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Modulo_ordem_key" ON "Modulo"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoCurso_userId_moduloId_key" ON "ProgressoCurso"("userId", "moduloId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_codigo_key" ON "Certificado"("codigo");

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoCurso" ADD CONSTRAINT "ProgressoCurso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoCurso" ADD CONSTRAINT "ProgressoCurso_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submissao" ADD CONSTRAINT "Submissao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
