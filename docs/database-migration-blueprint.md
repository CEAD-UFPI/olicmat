# Database Migration Blueprint — OLICMAT v2.0

**Version:** 1.1
**Date:** 2026-07-07

---

## 1. Migration Summary

The v2.0 refactor applied a single destructive-rebuild migration
(`20260609131525_refactor_olicmat_v2`) — see §2.1–§2.8. Two incremental
additive migrations followed after the refactor.

### Migration IDs

| ID | Type | Date | Notes |
|------|------|------|-------|
| `20260609131525_refactor_olicmat_v2` | Destructive rebuild | 2026-06-09 | Original v2.0 schema (see §2.1–§2.8) |
| `20260706230000_expand_user_instituicao` | Additive | 2026-07-06 | Added 9 new enums and ~22 User / ~15 Instituicao fields (CEP-backed localisation) |
| `20260707000000_add_curso_nota_enade` | Additive | 2026-07-07 | Added `notaEnade DECIMAL(5,2)` to `Curso` — see §2.9 |

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

### 2.9 Subsequent Additive Migrations

Two small additive migrations have been applied after the v2.0 rebuild
to extend the data model without breaking existing records.

#### `20260706230000_expand_user_instituicao` (2026-07-06)

Added 9 new enums (`Genero`, `RacaCor`, `TipoBolsa`, `Titulacao`,
`Localizacao`, `AreaAssentamento`, `EsferaAdministrativa`,
`StatusInstituicao`, `TipoInstituicao`) and ~22 new `User` fields
/ ~15 new `Instituicao` fields, including CEP-backed localisation
(CEP, complemento, pontoReferencia, localização, áreaAssentamento,
esferaAdministrativa, telefone, email, etc.). The Instituicao `estado`
column was renamed to `uf`. All new columns are nullable.

#### `20260707000000_add_curso_nota_enade` (2026-07-07)

| Table | Change | Type |
|-------|--------|------|
| `Curso` | Added `notaEnade` | `DECIMAL(5,2)` NULL — fx. 75.50, max 100 |

SQL applied:

```sql
ALTER TABLE "Curso" ADD COLUMN "notaEnade" DECIMAL(5,2);
```

Backend exposure:

| Endpoint | Method | Behavior |
|----------|--------|----------|
| `/api/admin/cursos` | POST | Accepts optional `notaEnade` (number 0–100) |
| `/api/admin/cursos/:id` | PATCH | Accepts `notaEnade` (number, or `null` to clear) |
| `/api/admin/cursos` `/api/admin/cursos/:id` | GET | Returns `notaEnade` (number or `null`) on each `Curso` payload |

Frontend exposure:

| Screen | Behavior |
|--------|----------|
| `/admin/cursos` (list table) | Renders ENADE column (formatted to 2 dp, or `—` when null) |
| `/admin/cursos` (create/edit modal) | Optional input — decimal 0–100 |
| `/admin/cursos` (DetailPanel hero metric) | Color-coded: ≥60 green (`#4CAF50`) / ≥40 amber (`#f59e0b`) / else red (`#e53e3e`) / null neutral |

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
