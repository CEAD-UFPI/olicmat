-- Suporte em tempo real à Fase 1. Só adiciona colunas, com default ou anuláveis:
-- código antigo continua funcionando com o banco já migrado.
ALTER TABLE "Inscricao" ADD COLUMN "fase1Advertencias" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Inscricao" ADD COLUMN "fase1FimMotivo" TEXT;
