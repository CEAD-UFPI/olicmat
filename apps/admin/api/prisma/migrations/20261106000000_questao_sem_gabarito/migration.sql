-- A prova pode ser cadastrada antes do gabarito oficial. Sem ele, a nota da
-- Fase 1 fica vazia até a correção. Eixo e dificuldade também são opcionais.
ALTER TABLE "Questao" ALTER COLUMN "correta" DROP NOT NULL;
ALTER TABLE "Questao" ALTER COLUMN "eixo" DROP NOT NULL;
ALTER TABLE "Questao" ALTER COLUMN "dificuldade" DROP NOT NULL;
