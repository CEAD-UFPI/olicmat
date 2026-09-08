-- Instituição fixada pelo convite, para quando a organização convida uma
-- coordenação: o convidado escolhe apenas o curso dentro dela.
-- Aditiva: coluna anulável, convites existentes seguem com NULL.

-- AlterTable
ALTER TABLE "Convite" ADD COLUMN     "instituicaoId" TEXT;

-- CreateIndex
CREATE INDEX "Convite_instituicaoId_idx" ON "Convite"("instituicaoId");

-- AddForeignKey
ALTER TABLE "Convite" ADD CONSTRAINT "Convite_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
