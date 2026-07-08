-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO_NAO_INFORMAR');
CREATE TYPE "RacaCor" AS ENUM ('BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDIGENA', 'OUTRO', 'PREFIRO_NAO_INFORMAR');
CREATE TYPE "TipoBolsa" AS ENUM ('PIBIC', 'PIBITI', 'PIBEX', 'PRAEC', 'PET', 'PROUNI', 'FIES', 'OUTRO');
CREATE TYPE "Titulacao" AS ENUM ('GRADUADO', 'ESPECIALIZACAO', 'MESTRE', 'DOUTOR', 'POS_DOUTOR');
CREATE TYPE "Localizacao" AS ENUM ('URBANA', 'RURAL');
CREATE TYPE "AreaAssentamento" AS ENUM ('NAO_DIFERENCIADA', 'AREA_ASSENTAMENTO', 'TERRA_INDIGENA', 'AREA_REMANESCENTE_QUILOMBO', 'UNIDADE_USO_SUSTENTAVEL');
CREATE TYPE "EsferaAdministrativa" AS ENUM ('FEDERAL', 'ESTADUAL', 'MUNICIPAL', 'INSTITUTO_FEDERAL', 'PRIVADA');
CREATE TYPE "StatusInstituicao" AS ENUM ('ATIVA', 'INATIVA');
CREATE TYPE "TipoInstituicao" AS ENUM ('PERMANENTE', 'TEMPORARIA');

-- AlterTable: Instituicao
-- First add uf and copy existing estado data, then drop estado
ALTER TABLE "Instituicao" ADD COLUMN "uf" TEXT;
UPDATE "Instituicao" SET "uf" = "estado";
ALTER TABLE "Instituicao" ALTER COLUMN "uf" SET NOT NULL;
ALTER TABLE "Instituicao" DROP COLUMN "estado";

-- Fix any NULL codigoInep before setting NOT NULL
UPDATE "Instituicao" SET "codigoInep" = 'MIGRATED_' || id WHERE "codigoInep" IS NULL OR "codigoInep" = '';
ALTER TABLE "Instituicao" ALTER COLUMN "codigoInep" SET NOT NULL;

-- Add remaining Instituicao columns
ALTER TABLE "Instituicao" ADD COLUMN "areaAssentamento" "AreaAssentamento";
ALTER TABLE "Instituicao" ADD COLUMN "cep" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN "complemento" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN "email" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN "esferaAdministrativa" "EsferaAdministrativa";
ALTER TABLE "Instituicao" ADD COLUMN "localizacao" "Localizacao";
ALTER TABLE "Instituicao" ADD COLUMN "municipio" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN "pontoReferencia" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN "status" "StatusInstituicao" DEFAULT 'ATIVA';
ALTER TABLE "Instituicao" ADD COLUMN "telefone" TEXT;
ALTER TABLE "Instituicao" ADD COLUMN "tipo" "TipoInstituicao";

-- AlterTable: User - add all new columns
ALTER TABLE "User" ADD COLUMN "areaFormacao" TEXT;
ALTER TABLE "User" ADD COLUMN "bairro" TEXT;
ALTER TABLE "User" ADD COLUMN "bolsista" BOOLEAN;
ALTER TABLE "User" ADD COLUMN "celular" TEXT;
ALTER TABLE "User" ADD COLUMN "cep" TEXT;
ALTER TABLE "User" ADD COLUMN "complemento" TEXT;
ALTER TABLE "User" ADD COLUMN "cotista" BOOLEAN;
ALTER TABLE "User" ADD COLUMN "documentoIdentificacao" TEXT;
ALTER TABLE "User" ADD COLUMN "enderecoCompleto" TEXT;
ALTER TABLE "User" ADD COLUMN "formacao" TEXT;
ALTER TABLE "User" ADD COLUMN "genero" "Genero";
ALTER TABLE "User" ADD COLUMN "municipio" TEXT;
ALTER TABLE "User" ADD COLUMN "nacionalidade" TEXT;
ALTER TABLE "User" ADD COLUMN "nomeSocial" TEXT;
ALTER TABLE "User" ADD COLUMN "numero" TEXT;
ALTER TABLE "User" ADD COLUMN "pontoReferencia" TEXT;
ALTER TABLE "User" ADD COLUMN "possuiDeficiencia" BOOLEAN;
ALTER TABLE "User" ADD COLUMN "racaCor" "RacaCor";
ALTER TABLE "User" ADD COLUMN "telefone" TEXT;
ALTER TABLE "User" ADD COLUMN "tipoBolsa" "TipoBolsa";
ALTER TABLE "User" ADD COLUMN "titulacao" "Titulacao";
ALTER TABLE "User" ADD COLUMN "uf" TEXT;
