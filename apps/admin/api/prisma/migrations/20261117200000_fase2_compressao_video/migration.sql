-- Fase 2: fila de compressão dos vídeos (compressor na VPS converte o original em 720p e apaga o original).

-- CreateEnum
CREATE TYPE "StatusVideoFase2" AS ENUM ('PENDENTE', 'PROCESSANDO', 'PRONTO', 'FALHA', 'SUBSTITUIDO');

-- CreateTable
CREATE TABLE "VideoFase2" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "chaveOriginal" TEXT NOT NULL,
    "bytesOriginal" BIGINT NOT NULL,
    "nomeOriginal" TEXT NOT NULL,
    "status" "StatusVideoFase2" NOT NULL DEFAULT 'PENDENTE',
    "chaveFinal" TEXT,
    "bytesFinal" BIGINT,
    "duracaoSeg" INTEGER,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "erro" TEXT,
    "arquivosRemovidos" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "iniciadoEm" TIMESTAMP(3),
    "concluidoEm" TIMESTAMP(3),

    CONSTRAINT "VideoFase2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoFase2_chaveOriginal_key" ON "VideoFase2"("chaveOriginal");

-- CreateIndex
CREATE INDEX "VideoFase2_status_criadoEm_idx" ON "VideoFase2"("status", "criadoEm");

-- CreateIndex
CREATE INDEX "VideoFase2_inscricaoId_idx" ON "VideoFase2"("inscricaoId");

-- AddForeignKey
ALTER TABLE "VideoFase2" ADD CONSTRAINT "VideoFase2_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

