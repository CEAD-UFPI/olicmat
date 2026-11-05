-- Integridade pós-rodada. "divergencia_nota" e "sem_finalizar" devem ser 0.
WITH r AS (
  SELECT i.id, i."fase1Inicio", i."fase1Fim", i."fase1Nota",
         count(x.id) AS respostas, count(x.id) FILTER (WHERE x.correta) AS corretas
  FROM "Inscricao" i LEFT JOIN "Resposta" x ON x."inscricaoId"=i.id
  WHERE i."edicaoId"='lt-edicao' GROUP BY i.id)
SELECT count(*) AS inscricoes,
       count("fase1Inicio") AS iniciaram,
       count("fase1Fim") AS finalizaram,
       count(*) FILTER (WHERE "fase1Fim" IS NULL) AS sem_finalizar,
       sum(respostas) AS respostas,
       count(*) FILTER (WHERE respostas<>20) AS incompletas,
       count(*) FILTER (WHERE "fase1Fim" IS NOT NULL AND abs(coalesce("fase1Nota",-1) - round(corretas*100.0/20,2))>0.01) AS divergencia_nota
FROM r;
