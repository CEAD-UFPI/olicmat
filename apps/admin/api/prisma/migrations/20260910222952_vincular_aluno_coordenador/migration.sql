-- AlterTable
ALTER TABLE "Convite" ADD COLUMN     "criadoPorId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coordenadorId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coordenadorId_fkey" FOREIGN KEY ("coordenadorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Convite" ADD CONSTRAINT "Convite_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
