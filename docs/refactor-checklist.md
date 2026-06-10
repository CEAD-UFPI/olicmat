# Refactor Checklist — OLICMAT v2.0

**Version:** 1.0
**Date:** 2026-06-09
**Status:** All items verified

---

## Schema & Database

- [x] Backup original schema (`schema.prisma.backup`)
- [x] Remove FORPEMAT models (Modulo, ProgressoCurso, Certificado)
- [x] Remove CONGEMAT models (Submissao)
- [x] Remove dead enums (TipoSubm, StatusSubm)
- [x] Add COORDENADOR_CURSO to Role enum
- [x] Add StatusProva enum (RASCUNHO, PUBLICADA, EM_ANDAMENTO, ENCERRADA)
- [x] Add StatusEnvioFase2 enum (PENDENTE, ENVIADO, AVALIADO)
- [x] Create Instituicao model (nome, sigla, estado)
- [x] Create Curso model (nome, instituicaoId FK)
- [x] Create CoordenadorCurso model (userId FK, cursoId FK)
- [x] Create Edicao model (ano, titulo, status, pesos, datas)
- [x] Create Prova model (edicaoId, fase, titulo, duracao, status, janelas)
- [x] Create ProvaQuestao join model (provaId, questaoId, ordem)
- [x] Create EnvioFase2 model (inscricaoId, tipo, arquivoUrl, status)
- [x] Create AvaliacaoFase2 model (inscricaoId, avaliadorId, nota, parecer)
- [x] Create RankingSnapshot model (edicaoId, estado, dados JSON)
- [x] Create AuditLog model (actorId, acao, entidade, entidadeId, payload)
- [x] Rename User.senha → senhaHash
- [x] Add User.instituicaoId and User.cursoId FKs
- [x] Remove User.instituicao and User.curso flat String fields
- [x] Add Inscricao.edicaoId FK
- [x] Add Inscricao.instituicaoId and Inscricao.cursoId FKs
- [x] Remove Inscricao.fase2VideoUrl, fase2PortfolioUrl, fase2Nota
- [x] Rename Resposta.alternativa → alternativaMarcada
- [x] Add Resposta.provaId FK
- [x] Add Resposta.updatedAt
- [x] Create and apply migration: `20260609131525_refactor_olicmat_v2`
- [x] Regenerate Prisma client
- [x] Rewrite seed.ts with OLICMAT test data
- [x] Configure seed in prisma.config.ts (Prisma 7.x `migrations.seed`)
- [x] Run seed via `prisma db seed` successfully

## Backend — Removals

- [x] Delete `backend/src/lms/` directory
- [x] Delete `backend/src/congresso/` directory
- [x] Delete `backend/src/app.controller.ts`
- [x] Delete `backend/src/app.service.ts`
- [x] Delete `backend/src/app.controller.spec.ts`
- [x] Remove LmsModule from app.module.ts
- [x] Remove CongressoModule from app.module.ts

## Backend — Updates

- [x] Update auth.service.ts: senha → senhaHash
- [x] Update auth.controller.ts: add esqueci-senha, redefinir-senha, me
- [x] Update users.service.ts: new FK fields, relation includes
- [x] Update inscricao.service.ts: edicaoId, instituicaoId/cursoId FKs
- [x] Update inscricao dto: UUID validation for FKs, remove phase2 fields
- [x] Update prova.service.ts: alternativa → alternativaMarcada, provaId
- [x] Update envio.service.ts: use EnvioFase2 model
- [x] Update ranking.service.ts: connect to Edicao, weighted scoring

## Backend — New Modules

- [x] Create `src/instituicoes/` module (catalog CRUD)
- [x] Create `src/admin/` parent module
- [x] Create `src/admin/provas/` module (exam CRUD)
- [x] Create `src/admin/questoes/` module (question CRUD)
- [x] Create `src/admin/avaliacao/` module (Phase 2 evaluation)
- [x] Create `src/admin/dashboard/` module (metrics, CSV export)
- [x] Create `src/admin/auditoria/` module (audit log)
- [x] Create `src/coordenacao/` module (coordinator views)
- [x] Register all new modules in app.module.ts
- [x] Backend builds cleanly (`npm run build` passes)

## Frontend — Removals

- [x] Delete `app/cursos/` directory
- [x] Delete `app/cursos/[moduloId]/` directory
- [x] Delete `app/congresso/` directory
- [x] Remove Modulo type from types/index.ts
- [x] Remove fase2VideoUrl/fase2PortfolioUrl from Inscricao type

## Frontend — Updates

- [x] Update Hero.tsx: OLICMAT-only tagline
- [x] Update Sobre.tsx: single OLICMAT focus, remove 3-pillar cards
- [x] Update Cronograma.tsx: remove FORPEMAT/CONGEMAT events
- [x] Update Footer.tsx: single OLICMAT column
- [x] Update Sidebar.tsx: role-aware navigation
- [x] Update dashboard layout: role-based content
- [x] Update app/layout.tsx: OLICMAT-only meta description
- [x] Update page.tsx: OLICMAT-only meta description
- [x] Update competidor/page.tsx: remove FORPEMAT/CONGEMAT CTA

## Frontend — New Pages

- [x] Create `app/(auth)/esqueci-senha/page.tsx`
- [x] Create `app/(auth)/redefinir-senha/page.tsx`
- [x] Create `app/(public)/regulamento/page.tsx`
- [x] Create `app/(public)/sobre/page.tsx`
- [x] Create `app/(public)/layout.tsx`
- [x] Create `app/(dashboard)/competidor/resultado/page.tsx`
- [x] Create `app/(dashboard)/coordenador/page.tsx`
- [x] Create `app/(dashboard)/coordenador/alunos/page.tsx`
- [x] Create `app/(dashboard)/coordenador/metricas/page.tsx`
- [x] Create `app/(dashboard)/avaliador/page.tsx`
- [x] Create `app/(dashboard)/avaliador/provas/page.tsx`
- [x] Create `app/(dashboard)/avaliador/provas/[id]/page.tsx`
- [x] Create `app/(dashboard)/avaliador/fase2/page.tsx`
- [x] Create `app/(dashboard)/admin/page.tsx`
- [x] Create `app/(dashboard)/admin/usuarios/page.tsx`
- [x] Create `app/(dashboard)/admin/inscricoes/page.tsx`
- [x] Create `app/(dashboard)/admin/provas/page.tsx`
- [x] Create `app/(dashboard)/admin/avaliacao/page.tsx`
- [x] Create `app/(dashboard)/admin/exportar/page.tsx`
- [x] Create `app/(dashboard)/admin/auditoria/page.tsx`

## Frontend — Infrastructure

- [x] Create middleware.ts (Next.js proxy for auth)
- [x] Create public/manifest.json (PWA)
- [x] Add PWA meta tags to root layout
- [x] Frontend builds cleanly (`npm run build` passes — 28 routes)

## Documentation

- [x] docs/refactor-audit.md
- [x] docs/refactor-plan.md
- [x] docs/role-permissions-matrix.md
- [x] docs/api-surface.md
- [x] docs/database-migration-blueprint.md
- [x] docs/frontend-route-map.md
- [x] CLAUDE.md (root)
- [x] docs/refactor-checklist.md (this file)
- [ ] docs/refactor-summary.md

---

## Verification Gates

| Gate | Status |
|------|--------|
| Prisma schema validates (`prisma generate` succeeds) | ✅ |
| Database migration applies cleanly | ✅ |
| Seed runs successfully | ✅ |
| Backend compiles (`npm run build`) | ✅ |
| Frontend compiles (`npm run build` — 28 routes) | ✅ |
| No FORPEMAT/CONGEMAT references in active source | ✅ |
| All new models have corresponding backend modules | ✅ |
| All roles have corresponding frontend routes | ✅ |
| RBAC guards on all admin endpoints | ✅ |
| PWA foundation in place | ✅ |
| Documentation matches implementation | ✅ |
