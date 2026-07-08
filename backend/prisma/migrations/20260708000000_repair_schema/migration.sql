-- Repair migration: handles broken state from failed 20260706230000 migration

-- Create missing enums (catch exception if already exists)
DO $$ BEGIN
  CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO_NAO_INFORMAR');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "RacaCor" AS ENUM ('BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDIGENA', 'OUTRO', 'PREFIRO_NAO_INFORMAR');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "TipoBolsa" AS ENUM ('PIBIC', 'PIBITI', 'PIBEX', 'PRAEC', 'PET', 'PROUNI', 'FIES', 'OUTRO');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "Titulacao" AS ENUM ('GRADUADO', 'ESPECIALIZACAO', 'MESTRE', 'DOUTOR', 'POS_DOUTOR');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "Localizacao" AS ENUM ('URBANA', 'RURAL');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "AreaAssentamento" AS ENUM ('NAO_DIFERENCIADA', 'AREA_ASSENTAMENTO', 'TERRA_INDIGENA', 'AREA_REMANESCENTE_QUILOMBO', 'UNIDADE_USO_SUSTENTAVEL');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "EsferaAdministrativa" AS ENUM ('FEDERAL', 'ESTADUAL', 'MUNICIPAL', 'INSTITUTO_FEDERAL', 'PRIVADA');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "StatusInstituicao" AS ENUM ('ATIVA', 'INATIVA');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "TipoInstituicao" AS ENUM ('PERMANENTE', 'TEMPORARIA');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instituicao: rename estado -> uf
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Instituicao' AND column_name = 'estado') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Instituicao' AND column_name = 'uf') THEN
      ALTER TABLE "Instituicao" ADD COLUMN "uf" TEXT;
      UPDATE "Instituicao" SET "uf" = "estado";
    END IF;
    ALTER TABLE "Instituicao" DROP COLUMN "estado";
  ELSE
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Instituicao' AND column_name = 'uf') THEN
      ALTER TABLE "Instituicao" ADD COLUMN "uf" TEXT;
    END IF;
  END IF;
END $$;

-- Make uf NOT NULL
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Instituicao' AND column_name = 'uf' AND is_nullable = 'YES') THEN
    UPDATE "Instituicao" SET "uf" = 'PI' WHERE "uf" IS NULL;
    ALTER TABLE "Instituicao" ALTER COLUMN "uf" SET NOT NULL;
  END IF;
END $$;

-- Add codigoInep if missing
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "codigoInep" TEXT;
UPDATE "Instituicao" SET "codigoInep" = 'MIGRATED_' || id WHERE "codigoInep" IS NULL OR "codigoInep" = '';

-- Add unique constraint on codigoInep if missing
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Instituicao_codigoInep_key') THEN
    ALTER TABLE "Instituicao" ADD CONSTRAINT "Instituicao_codigoInep_key" UNIQUE ("codigoInep");
  END IF;
END $$;

-- Remaining Instituicao columns
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "areaAssentamento" "AreaAssentamento";
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "cep" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "complemento" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "esferaAdministrativa" "EsferaAdministrativa";
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "localizacao" "Localizacao";
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "municipio" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "pontoReferencia" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "status" "StatusInstituicao" DEFAULT 'ATIVA';
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "telefone" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN IF NOT EXISTS "tipo" "TipoInstituicao";

-- User columns
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "areaFormacao" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bairro" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bolsista" BOOLEAN;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "celular" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cep" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "complemento" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cotista" BOOLEAN;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "documentoIdentificacao" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "enderecoCompleto" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "formacao" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "genero" "Genero";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "municipio" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "nacionalidade" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "nomeSocial" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "numero" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pontoReferencia" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "possuiDeficiencia" BOOLEAN;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "racaCor" "RacaCor";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "telefone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tipoBolsa" "TipoBolsa";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "titulacao" "Titulacao";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "uf" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailConfirmado" BOOLEAN DEFAULT false;
UPDATE "User" SET "emailConfirmado" = false WHERE "emailConfirmado" IS NULL;

-- EnvioFase2 missing columns
ALTER TABLE "EnvioFase2" ADD COLUMN IF NOT EXISTS "videoLink" TEXT;

-- Add COMISSAO role if missing (enum extension)
DO $$ BEGIN
  ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COMISSAO';
EXCEPTION WHEN invalid_parameter_value THEN null;
END $$;
