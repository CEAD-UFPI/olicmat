-- AlterEnum
ALTER TYPE "StatusProva" ADD VALUE 'EM_REVISAO';

-- AlterTable
ALTER TABLE "Edicao" ADD COLUMN     "desempate" TEXT[] DEFAULT ARRAY['NOTA_FASE2', 'NOTA_FASE1', 'IDADE']::TEXT[];

-- CreateIndex
CREATE INDEX "RankingSnapshot_edicaoId_idx" ON "RankingSnapshot"("edicaoId");

-- AddForeignKey
ALTER TABLE "RankingSnapshot" ADD CONSTRAINT "RankingSnapshot_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "Edicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
