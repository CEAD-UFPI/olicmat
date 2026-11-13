-- Fase 2: lista de classificados, início com prazo de 24h, envio por links,
-- avaliação por critérios com atribuição a avaliadores e e-mails de início.
-- CreateEnum
CREATE TYPE "StatusAtribuicaoFase2" AS ENUM ('PENDENTE', 'CONCLUIDA', 'REMANEJADA');

-- AlterTable
ALTER TABLE "Edicao" ADD COLUMN     "fase2IniciadaPorId" TEXT,
ADD COLUMN     "fase2InicioEm" TIMESTAMP(3),
ADD COLUMN     "fase2PrazoEm" TIMESTAMP(3),
ADD COLUMN     "fase2Tema" TEXT;

-- AlterTable
ALTER TABLE "Inscricao" ADD COLUMN     "fase2Classificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fase2Nota" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "EnvioFase2" ADD COLUMN     "portfolioLink" TEXT,
ALTER COLUMN "tipo" SET DEFAULT 'links',
ALTER COLUMN "arquivoUrl" SET DEFAULT '';

-- AlterTable
ALTER TABLE "AvaliacaoFase2" ADD COLUMN     "coerenciaPedagogica" DOUBLE PRECISION,
ADD COLUMN     "concluida" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dominioConteudo" DOUBLE PRECISION,
ADD COLUMN     "estrategiasEnsino" DOUBLE PRECISION,
ADD COLUMN     "reflexaoCritica" DOUBLE PRECISION,
ADD COLUMN     "usoTdics" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "AtribuicaoFase2" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "status" "StatusAtribuicaoFase2" NOT NULL DEFAULT 'PENDENTE',
    "atribuidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atribuidoPorId" TEXT,
    "concluidoEm" TIMESTAMP(3),

    CONSTRAINT "AtribuicaoFase2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailFase2" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "erro" TEXT,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailFase2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AtribuicaoFase2_avaliadorId_status_idx" ON "AtribuicaoFase2"("avaliadorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AtribuicaoFase2_inscricaoId_avaliadorId_key" ON "AtribuicaoFase2"("inscricaoId", "avaliadorId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailFase2_inscricaoId_key" ON "EmailFase2"("inscricaoId");

-- CreateIndex
CREATE INDEX "EnvioFase2_inscricaoId_enviadoEm_idx" ON "EnvioFase2"("inscricaoId", "enviadoEm");

-- AddForeignKey
ALTER TABLE "AtribuicaoFase2" ADD CONSTRAINT "AtribuicaoFase2_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuicaoFase2" ADD CONSTRAINT "AtribuicaoFase2_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailFase2" ADD CONSTRAINT "EmailFase2_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

