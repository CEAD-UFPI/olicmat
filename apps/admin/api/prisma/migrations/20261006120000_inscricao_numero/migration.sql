-- Número de inscrição sequencial. Backfill por ordem de criação das inscrições existentes.
CREATE SEQUENCE "Inscricao_numero_seq";

ALTER TABLE "Inscricao" ADD COLUMN "numero" INTEGER;

UPDATE "Inscricao" i
SET "numero" = r.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS rn
  FROM "Inscricao"
) r
WHERE i."id" = r."id";

SELECT setval('"Inscricao_numero_seq"', COALESCE((SELECT MAX("numero") FROM "Inscricao"), 0) + 1, false);

ALTER TABLE "Inscricao" ALTER COLUMN "numero" SET DEFAULT nextval('"Inscricao_numero_seq"');
ALTER TABLE "Inscricao" ALTER COLUMN "numero" SET NOT NULL;
ALTER SEQUENCE "Inscricao_numero_seq" OWNED BY "Inscricao"."numero";

CREATE UNIQUE INDEX "Inscricao_numero_key" ON "Inscricao"("numero");
