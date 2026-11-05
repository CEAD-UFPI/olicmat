-- Remove TODOS os dados sintéticos (só linhas com prefixo lt-).
BEGIN;
DELETE FROM "Resposta" WHERE "provaId"='lt-prova';
DELETE FROM "AuditLog" WHERE "actorId" LIKE 'lt-%';
DELETE FROM "ProvaQuestao" WHERE "provaId"='lt-prova';
DELETE FROM "Prova" WHERE id='lt-prova';
DELETE FROM "Questao" WHERE id LIKE 'lt-q-%';
DELETE FROM "Inscricao" WHERE "edicaoId"='lt-edicao';
DELETE FROM "User" WHERE id LIKE 'lt-%';
DELETE FROM "Edicao" WHERE id='lt-edicao';
DELETE FROM "Curso" WHERE id='lt-curso';
DELETE FROM "Instituicao" WHERE id='lt-inst';
COMMIT;
