-- Dados 100% sintéticos numa EDIÇÃO PRÓPRIA (ano 2099): a prova é localizada
-- pela edição da inscrição, então nada aqui alcança os participantes reais.
-- Uso: psql -v N=567 -v hash="'<bcrypt>'" -f seed.sql
BEGIN;
INSERT INTO "Instituicao"(id,nome,sigla,"codigoInep",uf,"updatedAt")
VALUES ('lt-inst','Instituição Carga','LOADTEST','LOADTEST','PI',now()) ON CONFLICT DO NOTHING;
INSERT INTO "Curso"(id,nome,"instituicaoId","updatedAt")
VALUES ('lt-curso','Curso Carga','lt-inst',now()) ON CONFLICT DO NOTHING;
INSERT INTO "Edicao"(id,ano,semestre,titulo,status,"updatedAt")
VALUES ('lt-edicao',2099,9,'TESTE DE CARGA','INSCRICOES',now()) ON CONFLICT DO NOTHING;

INSERT INTO "User"(id,nome,email,cpf,"senhaHash",role,matricula,"dataNascimento","emailConfirmado","instituicaoId","cursoId","updatedAt")
SELECT 'lt-user-'||i,'Carga '||i,'carga'||i||'@carga.olicmat.test',lpad((90000000000+i)::text,11,'0'),:hash,'ALUNO',
       'LT'||i,'2000-01-01',true,'lt-inst','lt-curso',now()
FROM generate_series(1,:N) i ON CONFLICT DO NOTHING;
INSERT INTO "User"(id,nome,email,cpf,"senhaHash",role,matricula,"dataNascimento","emailConfirmado","updatedAt")
VALUES ('lt-admin','Admin Carga','admin@carga.olicmat.test','89999999999',:hash,'ADMIN','LTADM','2000-01-01',true,now())
ON CONFLICT DO NOTHING;

INSERT INTO "Inscricao"(id,"userId","edicaoId",status,estado,"instituicaoId","cursoId","updatedAt")
SELECT 'lt-insc-'||i,'lt-user-'||i,'lt-edicao','CONFIRMADA','PI','lt-inst','lt-curso',now()
FROM generate_series(1,:N) i ON CONFLICT DO NOTHING;

INSERT INTO "Questao"(id,enunciado,"alternativaA","alternativaB","alternativaC","alternativaD","alternativaE",correta,eixo,dificuldade,"updatedAt")
SELECT 'lt-q-'||i, 'Questão sintética '||i||'. '||repeat('Seja f uma função real contínua no intervalo fechado considerado. ',12),
       repeat('Alternativa A. ',8),repeat('Alternativa B. ',8),repeat('Alternativa C. ',8),repeat('Alternativa D. ',8),repeat('Alternativa E. ',8),
       chr(65+(i%5)),'ALGEBRA','MEDIO',now()
FROM generate_series(1,20) i ON CONFLICT DO NOTHING;

INSERT INTO "Prova"(id,"edicaoId",fase,titulo,"duracaoMinutos",status,"janelaInicio","janelaFim","createdBy","updatedAt")
VALUES ('lt-prova','lt-edicao',1,'Prova de Carga',150,'PUBLICADA',now()-interval '1 hour',now()+interval '12 hours','lt-admin',now())
ON CONFLICT (id) DO UPDATE SET "janelaInicio"=now()-interval '1 hour',"janelaFim"=now()+interval '12 hours';
INSERT INTO "ProvaQuestao"(id,"provaId","questaoId",ordem)
SELECT 'lt-pq-'||i,'lt-prova','lt-q-'||i,i FROM generate_series(1,20) i ON CONFLICT DO NOTHING;
COMMIT;
