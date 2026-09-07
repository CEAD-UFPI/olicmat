-- AlterTable
ALTER TABLE "Convite" ADD COLUMN     "cursoId" TEXT;

-- CreateIndex
CREATE INDEX "Convite_cursoId_idx" ON "Convite"("cursoId");

-- AddForeignKey
ALTER TABLE "Convite" ADD CONSTRAINT "Convite_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
