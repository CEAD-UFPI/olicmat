# Database Migration Blueprint — OLICMAT v2.0

**Version:** 1.0
**Date:** 2026-06-09

---

## 1. Migration Summary

A single new migration was created to transform the database from the original three-pillar schema (OLICMAT + FORPEMAT + CONGEMAT) to the OLICMAT-only v2.0 schema.

### Migration ID
`20260609131525_refactor_olicmat_v2`

### Database
PostgreSQL 16, schema `public`, database `olicmat`

---

## 2. Changes Applied

### 2.1 Removed Tables

| Table | Original Domain | Reason |
|-------|----------------|--------|
| `Modulo` | FORPEMAT LMS | Out of scope per BRD_OLICMAT v2.0 §3.2 |
| `ProgressoCurso` | FORPEMAT LMS | Out of scope |
| `Certificado` | FORPEMAT LMS | Out of scope |
| `Submissao` | CONGEMAT Congress | Out of scope |

### 2.2 Removed Enums

| Enum | Original Domain | Values |
|------|----------------|--------|
| `TipoSubm` | CONGEMAT | ARTIGO, POSTER |
| `StatusSubm` | CONGEMAT | EM_AVALIACAO, APROVADO, REJEITADO |

### 2.3 Modified Enums

| Enum | Change |
|------|--------|
| `Role` | Added `COORDENADOR_CURSO` value |

### 2.4 Modified Columns

| Table | Old Name | New Name | Type Change |
|-------|----------|----------|-------------|
| `User` | `senha` | `senhaHash` | None (still String) |
| `User` | `instituicao` | — | Removed (replaced by `instituicaoId` FK) |
| `User` | `curso` | — | Removed (replaced by `cursoId` FK) |
| `Inscricao` | `instituicao` | — | Removed (replaced by `instituicaoId` FK) |
| `Inscricao` | `curso` | — | Removed (replaced by `cursoId` FK) |
| `Inscricao` | `fase2VideoUrl` | — | Removed (replaced by EnvioFase2 entity) |
| `Inscricao` | `fase2PortfolioUrl` | — | Removed (replaced by EnvioFase2 entity) |
| `Inscricao` | `fase2Nota` | — | Removed (replaced by AvaliacaoFase2 entity) |
| `Resposta` | `alternativa` | `alternativaMarcada` | None (still String) |
| `Resposta` | — | `provaId` | New FK to Prova |
| `Resposta` | — | `updatedAt` | New DateTime column |

### 2.5 New Tables Created

| Table | Key Columns |
|-------|-------------|
| `Instituicao` | id, nome, sigla (unique), estado, createdAt, updatedAt |
| `Curso` | id, nome, instituicaoId (FK), unique(nome, instituicaoId), createdAt, updatedAt |
| `CoordenadorCurso` | id, userId (FK, unique), cursoId (FK) |
| `Edicao` | id, ano (unique), titulo, status, dataInicio, dataFim, pesoFase1, pesoFase2, createdAt, updatedAt |
| `Prova` | id, edicaoId (FK), fase, titulo, duracaoMinutos, status, publicadaEm, janelaInicio, janelaFim, versao, createdBy, createdAt, updatedAt |
| `ProvaQuestao` | id, provaId (FK), questaoId (FK), ordem, unique(provaId, questaoId), unique(provaId, ordem) |
| `EnvioFase2` | id, inscricaoId (FK), tipo, arquivoUrl, status, enviadoEm |
| `AvaliacaoFase2` | id, inscricaoId (FK), avaliadorId (FK to User), nota, parecer, avaliadoEm, unique(inscricaoId, avaliadorId) |
| `RankingSnapshot` | id, edicaoId, estado?, dados (JSON), publicadoEm, createdAt |
| `AuditLog` | id, actorId (FK to User), acao, entidade, entidadeId, payload (JSON), createdAt |

### 2.6 New Enums Created

| Enum | Values |
|------|--------|
| `StatusProva` | RASCUNHO, PUBLICADA, EM_ANDAMENTO, ENCERRADA |
| `StatusEnvioFase2` | PENDENTE, ENVIADO, AVALIADO |

### 2.7 New Foreign Key Relationships

| Child | Parent | On Delete | Type |
|-------|--------|-----------|------|
| User.instituicaoId | Instituicao.id | SET NULL | Optional |
| User.cursoId | Curso.id | SET NULL | Optional |
| Curso.instituicaoId | Instituicao.id | CASCADE | Required |
| CoordenadorCurso.userId | User.id | CASCADE | Required |
| CoordenadorCurso.cursoId | Curso.id | CASCADE | Required |
| Inscricao.edicaoId | Edicao.id | RESTRICT | Required |
| Inscricao.instituicaoId | Instituicao.id | RESTRICT | Required |
| Inscricao.cursoId | Curso.id | RESTRICT | Required |
| Prova.edicaoId | Edicao.id | RESTRICT | Required |
| ProvaQuestao.provaId | Prova.id | CASCADE | Required |
| ProvaQuestao.questaoId | Questao.id | CASCADE | Required |
| Resposta.provaId | Prova.id | RESTRICT | Required |
| EnvioFase2.inscricaoId | Inscricao.id | CASCADE | Required |
| AvaliacaoFase2.inscricaoId | Inscricao.id | CASCADE | Required |
| AvaliacaoFase2.avaliadorId | User.id | CASCADE | Required |
| AuditLog.actorId | User.id | RESTRICT | Required |

### 2.8 New Unique Constraints

| Table | Constraint |
|-------|------------|
| Curso | `@@unique([nome, instituicaoId])` |
| Inscricao | `@@unique([userId, edicaoId])` — one enrollment per user per edition |
| ProvaQuestao | `@@unique([provaId, questaoId])` — a question appears once per exam |
| ProvaQuestao | `@@unique([provaId, ordem])` — unique ordering within exam |
| Resposta | `@@unique([inscricaoId, provaId, questaoId])` — one answer per enrollment+exam+question |
| AvaliacaoFase2 | `@@unique([inscricaoId, avaliadorId])` — one evaluation per evaluator per enrollment |

---

## 3. Migration Execution

### Preconditions
- Database: PostgreSQL 16 (`olicmat-db` Docker container)
- Environment: `DATABASE_URL=postgresql://olicmat:olicmat_dev@localhost:5433/olicmat`

### Steps Executed
1. Backed up schema: `prisma/schema.prisma.backup`
2. Removed old migration: `migrations/20260506015847_init/`
3. Dropped all tables via direct SQL: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
4. Created and applied migration: `prisma migrate dev --name refactor_olicmat_v2`
5. Generated client: `prisma generate`
6. Ran seed: `tsx prisma/seed.ts`

### Seed Data Created
- 3 institutions (UFPI, UFMA, UECE)
- 3 courses (one per institution)
- 4 users (admin, coordenador, avaliador, aluno)
- 1 edition (OLICMAT 2026, status EM_ANDAMENTO)
- 5 sample questions across all eixos and dificuldades
- 1 exam (rascunho, 5 questions)
- 1 enrollment (aluno, CONFIRMADA)

---

## 4. Rollback Procedure

To roll back to the old schema:

1. Copy the backup schema: `cp prisma/schema.prisma.backup prisma/schema.prisma`
2. Reset the database: `DATABASE_URL=... npx prisma migrate reset --force`
3. Re-run old seed: `DATABASE_URL=... npx tsx prisma/seed.ts`

---

## 5. Future Migration Strategy

For future schema changes, use Prisma's incremental migration workflow:

```bash
# After modifying schema.prisma:
npx prisma migrate dev --name <descriptive_name>

# In production:
npx prisma migrate deploy
```

Each migration should be:
- **Small** — one logical change per migration
- **Reversible** — document rollback steps
- **Tested** — verify with seed data before applying
