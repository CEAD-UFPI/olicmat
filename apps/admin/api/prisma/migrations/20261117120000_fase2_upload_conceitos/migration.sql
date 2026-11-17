-- Fase 2: upload dos arquivos na nuvem própria e critérios do Manual (conceitos 0 a 5).
--
-- Os critérios antigos (25/25/20/15/15) nunca foram usados: a Fase 2 não tinha
-- sido iniciada. Por segurança, a migração aborta se houver alguma avaliação
-- com nota nesses critérios, em vez de apagá-la.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "AvaliacaoFase2"
    WHERE "dominioConteudo" IS NOT NULL OR "estrategiasEnsino" IS NOT NULL
       OR "usoTdics" IS NOT NULL OR "reflexaoCritica" IS NOT NULL OR "coerenciaPedagogica" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Há avaliações da Fase 2 com os critérios antigos; migração interrompida para não perder dados.';
  END IF;
END $$;

-- AlterTable
ALTER TABLE "EnvioFase2" ADD COLUMN     "portfolioBytes" BIGINT,
ADD COLUMN     "portfolioKey" TEXT,
ADD COLUMN     "portfolioNome" TEXT,
ADD COLUMN     "videoBytes" BIGINT,
ADD COLUMN     "videoKey" TEXT,
ADD COLUMN     "videoNome" TEXT;

-- AlterTable
ALTER TABLE "AvaliacaoFase2" DROP COLUMN "coerenciaPedagogica",
DROP COLUMN "dominioConteudo",
DROP COLUMN "estrategiasEnsino",
DROP COLUMN "reflexaoCritica",
DROP COLUMN "usoTdics",
ADD COLUMN     "criterio1" INTEGER,
ADD COLUMN     "criterio2" INTEGER,
ADD COLUMN     "criterio3" INTEGER,
ADD COLUMN     "criterio4" INTEGER,
ADD COLUMN     "criterio5" INTEGER;

