-- AlterTable: Curso
-- Adds optional ENADE Score (5-digit total, 2 decimal places, e.g. 100.00).
ALTER TABLE "Curso" ADD COLUMN "notaEnade" DECIMAL(5,2);