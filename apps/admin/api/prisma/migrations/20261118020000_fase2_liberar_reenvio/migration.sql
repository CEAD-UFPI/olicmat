-- Envio único da Fase 2: liberação excepcional de um novo envio pela Comissão.
ALTER TABLE "Inscricao"
  ADD COLUMN "fase2ReenvioVideo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "fase2ReenvioPortfolio" BOOLEAN NOT NULL DEFAULT false;
