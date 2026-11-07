-- Horário-limite para iniciar a prova e sessão única do participante.
-- Só adiciona colunas anuláveis: código antigo continua funcionando.
ALTER TABLE "Prova" ADD COLUMN "limiteInicio" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "sessaoId" TEXT;
ALTER TABLE "User" ADD COLUMN "sessaoDispositivo" TEXT;
ALTER TABLE "User" ADD COLUMN "sessaoVistaEm" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "sessaoConflitoEm" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "sessaoEntradaId" TEXT;
