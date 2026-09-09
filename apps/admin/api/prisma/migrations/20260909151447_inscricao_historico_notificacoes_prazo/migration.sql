-- AlterTable
ALTER TABLE "Edicao" ADD COLUMN     "prazoInscricao" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "InscricaoHistorico" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "statusAnterior" "StatusInsc" NOT NULL,
    "statusNovo" "StatusInsc" NOT NULL,
    "justificativa" TEXT,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InscricaoHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "link" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InscricaoHistorico_inscricaoId_idx" ON "InscricaoHistorico"("inscricaoId");

-- CreateIndex
CREATE INDEX "Notificacao_userId_lida_idx" ON "Notificacao"("userId", "lida");

-- AddForeignKey
ALTER TABLE "InscricaoHistorico" ADD CONSTRAINT "InscricaoHistorico_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscricaoHistorico" ADD CONSTRAINT "InscricaoHistorico_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
