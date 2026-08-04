# OLICMAT v2.0 — Project Guide

## Overview

OLICMAT is a full-stack web platform for managing the Olimpíada para Licenciandos em
Matemática, a nationwide Brazilian olympiad for Mathematics Education undergraduates.

**Stack:** Next.js 16 + NestJS 11 + PostgreSQL 16 (Prisma 7.8) / Cloudinary / Docker

## Directory Structure

```
olicmat/
├── backend/             # NestJS API (TypeScript, ESM)
│   ├── prisma/          # Schema + migrations
│   ├── generated/       # Prisma client (generated, not committed)
│   ├── src/
│   │   ├── auth/        # Auth (register, login, JWT, password reset)
│   │   ├── users/       # User profile
│   │   ├── instituicoes/# Institutions & courses catalog
│   │   ├── olimpiada/   # Core: inscricao, prova (mod 2), envio, ranking
│   │   ├── admin/       # Module 1: Config (provas, questoes, dashboard, auditoria)
│   │   ├── correcao/    # Module 3: Correction/evaluation (extracted from admin/)
│   │   ├── coordenacao/ # Coordinator views
│   │   ├── upload/      # Cloudinary file upload service
│   │   ├── common/      # Guards (JwtAuthGuard, RolesGuard), decorators
│   │   ├── prisma.service.ts  # Global PrismaModule singleton
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── Dockerfile
├── frontend/            # Next.js 16 App Router (TypeScript)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, registro, password recovery
│   │   │   ├── (dashboard)/    # Role-protected routes
│   │   │   │   ├── admin/      # ADMIN dashboard
│   │   │   │   ├── avaliador/  # AVALIADOR dashboard
│   │   │   │   ├── competidor/ # ALUNO dashboard
│   │   │   │   └── coordenador/# COORDENADOR_CURSO dashboard
│   │   │   ├── (public)/       # Regulamento, Sobre
│   │   │   └── ranking/        # Public ranking
│   │   ├── components/         # layout/, landing/, prova/, ui/, exam/
│   │   ├── stores/             # Zustand (authStore, provaStore)
│   │   ├── lib/                # API client (Axios), utils
│   │   ├── types/              # TypeScript interfaces
│   │   └── middleware.ts       # Auth middleware (token check)
│   └── Dockerfile
├── docs/                # PRD, BRD, SRS, refactor plans
├── docker-compose.yml
└── docker-compose.prod.yml
```

## 3-Module Architecture

The system is split into three explicit operational modules:

| Module | Backend Routes | Frontend Pages | Description |
|--------|----------------|----------------|-------------|
| **Config/Results** | `/api/auth/*`, `/api/users/*`, `/api/instituicoes/*`, `/api/admin/*`, `/api/inscricoes/*`, `/api/envio/*`, `/api/ranking/*`, `/api/coordenacao/*` | `(dashboard)/admin/*`, `/coordenador/*`, `/competidor/{inscricao,envio,resultado}`, `/avaliador/provas` | System settings, master data, registrations, results, reports, exports, audit |
| **Exam** (isolated) | `/api/prova/*`, `POST /api/inscricoes/minha/iniciar-prova` | `/competidor/prova` (wrapped in ExamGuard) | Lightweight exam execution with anti-cheating enforcement (fullscreen, focus detection, auto-submit) |
| **Correction** | `/api/correcao/*` | `/admin/avaliacao`, `/avaliador/fase2`, `/comissao/avaliacao` | Phase 2 evaluation: pending submissions, grading, history, evaluator queues |

## Roles

| Role | Dashboard | Module Access | Description |
|------|-----------|---------------|-------------|
| ALUNO | `/competidor` | Config (self-service) + Exam | Register, enroll, take exams, Phase 2 |
| COORDENADOR_CURSO | `/coordenador` | Config (read-only) | View students, monitor enrollments |
| AVALIADOR | `/avaliador` | Config (provas) + Correction | Create questions, manage exams, evaluate Phase 2 |
| ADMIN | `/admin` | Config (full) + Correction | Full access: users, enrollments, exams, exports, audit, evaluation |
| COMISSAO | `/comissao` | Config (read-only) + Correction (read-only) | Oversight: monitor inscriptions, evaluations, audit |

## Production Deployment (3 Containers)

A aplicação roda em produção no **Easypanel** com 3 containers independentes:

| Container | Imagem | Porta | Função |
|-----------|--------|-------|--------|
| `olicmat-db` | `postgres:16-alpine` | 5432 | Banco de dados PostgreSQL |
| `olicmat-api` | `olicmat-backend` | 3333 | API NestJS (Prisma) |
| `olicmat-web` | `olicmat-frontend` | 3000 | Frontend Next.js |

- Cada container é **independente** e orquestrado via `docker-compose.yml`
- Migrations do Prisma rodam automaticamente no startup do backend (`prisma migrate deploy`)
- Variáveis de ambiente (JWT_SECRET, Cloudinary, DATABASE_URL) configuradas no Easypanel
- O frontend acessa a API via `NEXT_PUBLIC_API_URL` apontando para o domínio público do backend

## Key Conventions

- **Validation:** Zod everywhere (backend DTOs, frontend forms with react-hook-form)
- **Auth:** JWT Bearer token (NestJS Passport) + Zustand store + cookie for middleware
- **Role guards:** `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` using enum from `generated/prisma/client.js`
- **Imports (backend):** ESM with `.js` extensions, `../../generated/prisma/client.js` for Prisma types
- **Portuguese:** Domain entities (inscricao, prova, questao, envio)
- **PrismaService:** Global module — no need to add `PrismaService` to any module's providers; import the service directly where needed

## Recent Structural Refactor (2026-07-06)

1. **3-module backend split** — `admin/avaliacao/` extracted to independent `correcao/` module at route `/api/correcao/*`; `AppModule` now groups imports with explicit module comments; `AdminModule` no longer imports `AvaliacaoModule`
2. **3-module frontend split** — Sidebar redesigned with three explicit sections (Config, Prova, Correção); evaluation pages (`admin/avaliacao`, `avaliador/fase2`, `comissao/avaliacao`) now call `/api/correcao/*` endpoints instead of `/api/admin/avaliacao/*`
3. **Exam security** — New `ExamGuard` component wraps the prova page with fullscreen enforcement, visibility/focus detection, warning counter (3 max), auto-submit on limit exceeded, keyboard shortcut interception, context menu and copy prevention
4. **Data model expansion** — Migration `20260706230000_expand_user_instituicao` added 9 new enums, ~22 User fields, ~15 Instituicao fields with CEP integration
5. **Sidebar** — Navigation now grouped by operational module with section headers (Config/Prova/Correção)

## Recent Fixes (2026-07-02)

1. **PrismaService** — Made global singleton (was instantiated 10+ times)
2. **Registration** — Now resolves instituicao/curso names to FKs via upsert
3. **Schema** — Removed `Inscricao.userId @unique` (user can enroll in multiple editions)
4. **Exam questions** — Now filtered through ProvaQuestao (was pulling random questions from all DB)
5. **On-the-fly Prova creation** — Removed; admin must create exams properly
6. **resumoProva** — Fixed `respondidas = total` bug (now counts provaQuestoes for total)
7. **Roles** — All controllers use `Role` enum consistently
8. **Login redirect** — Now role-aware (not always `/competidor`)
9. **Frontend types** — Synced with Prisma schema; missing types added (Resposta, EnvioFase2, etc.)
10. **Medalha emoji** — Fixed display (was showing "1"/"2"/"3" instead of medal emojis)
11. **Inscription form** — Added comprovante de matrícula upload
12. **Dead deps** — Removed class-validator, class-transformer, @types/multer

## Standalone Exam Application & Complete Redis Removal (2026-08-04)

1. **Standalone Exam Application (`exam-app`)** — Extracted Phase 1 exam execution to an independent application (`exam-backend` + `exam-frontend`) intended to run on a separate machine in the internal network (`10.42.0.0/16`).
2. **Unified Auth via Transition Tokens** — Student logs in on main system; clicking "Ir para a prova" calls `POST /api/auth/transition-token` (120s TTL) and redirects to `https://prova.olicmat.cead.ufpi.br/auth/claim?token=...`.
3. **Subdomain Reverse Proxy** — Public server reverse proxies `prova.olicmat.cead.ufpi.br` to internal exam machine. If the exam app fails on exam day, the main public application remains fully operational.
4. **Complete Redis Removal** — Confirmed 100% absence of Redis dependencies, configs, and adapters. Sessions rely strictly on stateless JWTs and PostgreSQL Prisma queries.
5. **Operational Live Monitoring** — Exam backend exposes `/api/prova/monitoring/live-stats` for Admin and Coordinator oversight inside the exam portal (`/admin/monitoring`).

## DetailPanel Unification + ENADE Score (2026-07-07)

1. **Unified entity viewer** — All entity detail modals (User, Institution, Course, Edition, Registration) now use a single schema-driven `<DetailPanel>` component (`frontend/src/components/ui/detail-panel.tsx`), built on top of the shared `<Modal>`. Wider (max-w-3xl), labeled sections with 2-col grid on desktop, hero KPI slot with semantic colors, secondary Edit action surfaced in the header. Supersedes the per-page helpers `Row`, `FieldGroup`, `DetailField`.
2. **Missing view screens added** — Course and Edition admin pages now ship Eye (view) actions that open `<DetailPanel>` (previously these two entities had no view screen, only edit/delete buttons).
3. **Registration view expanded** — Inscription details now expose `fase1Nota`, `fase2Tema`, `notaFinal`, `medalha`, edition context, and a friendly empty-state for "change history" (AuditLog remains a placeholder until the backend starts writing to it).
4. **ENADE Score field** — New `notaEnade Decimal?(5,2)` column on `Curso` (Prisma migration `20260707000000_add_curso_nota_enade`). Backend `POST/PATCH /api/admin/cursos` accept it; frontend create/edit form exposes it; list table shows it; DetailPanel hero metric is color-coded (≥60 green / ≥40 amber / else red). Fully backwards compatible (nullable column, optional DTO field).
5. **Shared UX contract** — New `<StatusBadge>`, `<InlineList>`, `<EmptyState>` widgets shipped from the same `detail-panel.tsx` file; the registration table on admin/comissão pages now uses `<StatusBadge>` and the shared `INSCRICAO_STATUS` map, removing per-table ad-hoc color/label dictionaries.
6. **Smooth open/close** — Detail modal transitions are fade + scale, with staggered fade-in of inner sections, cards, timeline items and meter fills.
7. **Documentation** — All affected docs (CLAUDE.md, AGENTS.md, SRS_OLICMAT.md, api-surface.md, database-migration-blueprint.md, refactor-summary.md, frontend-route-map.md, PRD_OLICMAT.md, role-permissions-matrix.md, README.md) updated to reflect this release. New `docs/CHANGELOG.md` was created.

## Remaining Risks / Known Issues

### Backend

| Issue | Priority | Notes |
|-------|----------|-------|
| Password recovery | P1 | Both endpoints are placeholders; no email sent |
| Email confirmation | P1 | Not implemented |
| AuditLog never written | P1 | Model exists, endpoints work, but no code calls `auditLog.create()` |
| CSV exports manual | P1 | Uses `join(",")` without escaping commas/ quotes in data |
| Medalha update not in transaction | P1 | `atualizarMedalhas` loops without `$transaction` |
| No pagination on list endpoints | P2 | Backend returns all records; frontend does client-side pagination |
| No rate limiting | P2 | Authentication endpoints have no rate limits |
| Cloudinary env vars empty | P2 | `CLOUDINARY_*` are not set; uploads will fail in production |
| RankingSnapshot unused | P2 | Model exists but ranking is computed live every request |
| No tests | P2 | Zero test files in backend or frontend |
| Edicao auto-creation | P2 | Inscricao service creates editions on-the-fly if none exist |
| Fase 1 nota threshold hardcoded | P2 | 60% minimum for Phase 2 eligibility is hardcoded |

### Frontend

| Issue | Priority | Notes |
|-------|----------|-------|
| admin/avaliador exam editor duplicated | P1 | 479+ lines duplicated in both dashboards (ProvaDetalhePage) |
| admin/avaliador Phase 2 evaluation duplicated | P1 | Same grouping/grading logic in both (3 separate files call /correcao/*) |
| ExamGuard is client-side only | P2 | Cannot prevent dedicated cheating tools; documented in docs |
| ExamGuard auto-submit endpoint | P2 | Calls `/prova/finalizar` which may 400 if already finalized |
| No server-side role enforcement | P2 | Middleware only checks token; roles enforced client-side |
| Forced dark mode | P2 | No light theme support; hex values everywhere instead of CSS vars |
| Instituicao/Curso text inputs | P2 | Should be autocomplete dropdowns from API |
| No test infrastructure | P2 | No test runner configured |
| PWA manifest icons empty | P2 | `manifest.json` generated but `icons: []` |
| Header Dashboard link hardcoded | P2 | Points to `/competidor` for all users |
| `eslint-disable` comments | P3 | 4 suppressions in the codebase |
