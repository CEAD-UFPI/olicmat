-- Zera o estado da prova sintética entre rodadas.
DELETE FROM "Resposta" WHERE "provaId"='lt-prova';
UPDATE "Inscricao" SET "fase1Inicio"=NULL,"fase1Fim"=NULL,"fase1Nota"=NULL,"fase1TempoExtraMinutos"=0 WHERE "edicaoId"='lt-edicao';
