-- Add explicit indexes for the hot read paths identified in the load test.
--
-- @@unique constraints already create backing indexes for uniqueness checks,
-- but they do not necessarily cover the access patterns used by ProvaService:
--   - resposta.findMany WHERE inscricaoId = ? AND questaoId IN (...)
--   - resposta.groupBy  WHERE inscricaoId = ?  (used in finalizarProva / resumoProva)
--   - resposta.count    WHERE inscricaoId = ? AND correta = true
--
-- Adding @@index([inscricaoId]) on Resposta speeds up the groupBy/count by
-- inscricaoId (the most selective predicate). The compound @@unique on
-- (inscricaoId, provaId, questaoId) already covers point lookups, but a
-- single-column index on inscricaoId alone is cheaper for the planner when
-- the other columns are not filtered.
--
-- ProvaQuestao already has @@unique([provaId, questaoId]) and
-- @@unique([provaId, ordem]) which cover the provaQuestao.findMany WHERE
-- provaId = ? ORDER BY ordem access pattern, so no additional index is
-- strictly required. We still add @@index([provaId]) for clarity and to
-- give the planner a smaller index to choose for count-by-provaId.

CREATE INDEX IF NOT EXISTS "Resposta_inscricaoId_idx" ON "Resposta"("inscricaoId");
CREATE INDEX IF NOT EXISTS "Resposta_inscricaoId_correta_idx" ON "Resposta"("inscricaoId", "correta");
CREATE INDEX IF NOT EXISTS "ProvaQuestao_provaId_idx" ON "ProvaQuestao"("provaId");