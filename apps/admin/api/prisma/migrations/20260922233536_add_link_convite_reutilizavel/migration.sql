-- AlterTable
ALTER TABLE "User" ADD COLUMN     "origemLinkId" TEXT;

-- CreateTable
CREATE TABLE "LinkConvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "instituicaoId" TEXT,
    "cursoId" TEXT,
    "criadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkConvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkConvite_token_key" ON "LinkConvite"("token");

-- CreateIndex
CREATE INDEX "LinkConvite_criadoPorId_idx" ON "LinkConvite"("criadoPorId");

-- CreateIndex
CREATE INDEX "LinkConvite_token_idx" ON "LinkConvite"("token");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_origemLinkId_fkey" FOREIGN KEY ("origemLinkId") REFERENCES "LinkConvite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkConvite" ADD CONSTRAINT "LinkConvite_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkConvite" ADD CONSTRAINT "LinkConvite_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkConvite" ADD CONSTRAINT "LinkConvite_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
