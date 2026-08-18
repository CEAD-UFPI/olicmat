/*
  Warnings:

  - A unique constraint covering the columns `[ano,semestre]` on the table `Edicao` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Edicao_ano_key";

-- AlterTable
ALTER TABLE "Edicao" ADD COLUMN     "semestre" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Edicao_ano_semestre_key" ON "Edicao"("ano", "semestre");
