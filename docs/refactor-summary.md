# Refactor Summary — OLICMAT v2.1

**Version:** 2.2
**Date:** 2026-08-04
**Author:** Implementation Team
**Status:** Complete (Standalone Exam Application Extraction & Complete Redis Removal)

---

## Standalone Exam Application & Complete Redis Removal (2026-08-04)

This major architectural refactor completely extracts the Exam Module into a standalone application (`olicmat-exam-api` + `olicmat-exam-web`) running on an internal network (`10.42.0.0/16`), establishes a secure short-lived transition token authentication flow, confirms 100% Redis removal, and guarantees fault isolation between the main platform and the exam environment.

### Key Highlights & Changes

1. **Complete Redis Removal**: Verified zero Redis dependencies across backend packages, frontend, environment configs, and Docker services. Authentication relies 100% on stateless JWTs signed with `JWT_SECRET` and PostgreSQL Prisma database queries.
2. **Standalone Exam Application (`exam-app`)**:
   - `exam-backend` (`olicmat-exam-api`): Dedicated NestJS API running on internal port 3334. Implements exam start, question loading, autosave, submission, auto-correction, and real-time monitoring.
   - `exam-frontend` (`olicmat-exam-web`): Dedicated Next.js application running on internal port 3003. Features `ExamGuard` (fullscreen, visibility detection, warning limit, auto-submit), countdown timer, question navigator, and real-time score summary.
3. **Unified Auth & Transition Token Flow**:
   - Main system issues short-lived transition tokens (`POST /api/auth/transition-token`, 120s TTL) for eligible students and privileged roles (ADMIN / COORDENADOR).
   - Exam Application validates tokens at `/auth/claim` (`POST /api/auth/claim`) and issues a 4-hour `EXAM_SESSION` JWT.
   - Shared single database (`olicmat-db`) — no duplicate databases or separate user bases.
4. **Deployment & Subdomain Isolation**:
   - Public server reverse proxies `https://prova.olicmat.cead.ufpi.br` over internal network (`10.42.0.x`) to the internal exam machine.
   - If the exam application fails or experiences heavy load on exam day, the main public application (`https://olicmat.cead.ufpi.br`) remains fully operational.
5. **Access Controls**:
   - Students inside the exam application are restricted exclusively to active exam execution and resume flows.
   - Admins and Coordinators gain real-time operational monitoring (`/admin/monitoring`).

---

## DetailPanel Unification + ENADE Score (2026-07-07)

This incremental release standardises every "view" modal on the admin
and comissão dashboards onto a single reusable component, and introduces
the ENADE Score attribute on `Curso`. See `docs/CHANGELOG.md` for the
exhaustive change list.

### What changed

1. **Unified entity viewer (`<DetailPanel>`)** — All entity detail modals
   (User, Institution, Course, Edition, Registration) now consume a single
   schema-driven component at `frontend/src/components/ui/detail-panel.tsx`,
   built on top of the shared `<Modal>`. Wider (`max-w-3xl` ≈ 768px),
   labeled sections with 2-col grid on desktop, hero KPI slot with
   semantic colors. Supersedes the per-page helpers `Row`, `FieldGroup`,
   `DetailField`.
2. **Missing view screens added** — `/admin/cursos` and `/admin/edicoes`
   previously shipped only edit/delete actions. They now ship Eye
   actions that open `<DetailPanel>`.
3. **Registration view expanded** — Inscription details now expose
   `fase1Nota`, `fase2Tema`, `notaFinal`, `medalha`, edition context, and
   a friendly empty-state for "change history" (AuditLog remains a
   placeholder until the backend starts writing to it).
4. **ENADE Score field** — New `notaEnade Decimal?(5,2)` column on
   `Curso` (Prisma migration `20260707000000_add_curso_nota_enade`).
   Backend `POST/PATCH /api/admin/cursos` accept it; frontend create/edit
   form exposes it; list table shows it; DetailPanel hero metric is
   color-coded (≥60 green / ≥40 amber / else red). Fully backwards
   compatible (nullable column, optional DTO field).
5. **Shared UX contract** — New `<StatusBadge>`, `<InlineList>`,
   `<EmptyState>` widgets shipped from the same `detail-panel.tsx` file;
   the registration table on admin/comissão pages now uses
   `<StatusBadge>` and the shared `INSCRICAO_STATUS` map, removing
   per-table ad-hoc color/label dictionaries.
6. **Smooth open/close** — Detail modal transitions are fade + scale,
   with staggered fade-in of inner sections, cards, timeline items and
   meter fills.
7. **Documentation** — All affected docs (CLAUDE.md, AGENTS.md,
   SRS_OLICMAT.md, api-surface.md, database-migration-blueprint.md,
   refactor-summary.md, frontend-route-map.md, PRD_OLICMAT.md,
   role-permissions-matrix.md, README.md) updated to reflect this
   release. New `docs/CHANGELOG.md` was created.

---

## Executive Summary

The OLICMAT platform has been fully refactored from the original three-pillar architecture (OLICMAT + FORPEMAT + CONGEMAT) to an OLICMAT-only platform, aligned with the updated PRD_OLICMAT.md, BRD_OLICMAT.md, and SRS_OLICMAT.md v2.0 documents.

---

## 3-Module Architecture Refactor (2026-07-06)

### Backend Module Split

The backend was reorganized into three explicit operational modules:

| Module | Nest Module | Route Prefixes | Description |
|--------|-------------|----------------|-------------|
| **Config/Results** | `AdminModule`, `AuthModule`, `UsersModule`, `OlimpiadaModule` (inscricao, envio, ranking), `InstituicoesModule`, `CoordenacaoModule` | `/api/auth/*`, `/api/users/*`, `/api/instituicoes/*`, `/api/admin/*`, `/api/inscricoes/*`, `/api/envio/*`, `/api/ranking/*`, `/api/coordenacao/*` | System settings, master data, registrations, results, reports, exports, audit |
| **Exam** (isolated) | `OlimpiadaModule` (prova only) | `/api/prova/*` | Lightweight exam execution with anti-cheating |
| **Correction** | `CorrecaoModule` (new) | `/api/correcao/*` | Phase 2 evaluation: pending submissions, grading, history |

Key changes:
- `CorrecaoModule` was extracted from `admin/avaliacao/` to its own top-level module at route `/api/correcao/*`
- `AdminModule` no longer imports `AvaliacaoModule` (deprecated in place)
- `AppModule` now groups imports with explicit `Module 1/2/3` comments

### Frontend Module Split

Navigation and route organization follows the same three modules:

| Module | Routes | Description |
|--------|--------|-------------|
| **Config** | `/admin/*`, `/avaliador/*` (provas only), `/competidor/{inscricao,envio,resultado}`, `/coordenador/*`, `/comissao/*` | All configuration, registration, and results pages |
| **Exam** | `/competidor/prova` | Exam-taking page wrapped in ExamGuard |
| **Correction** | `/admin/avaliacao`, `/avaliador/fase2`, `/comissao/avaliacao` | Phase 2 evaluation (API calls point to `/api/correcao/*`) |

Key changes:
- Sidebar redesigned with three explicit section headers (Config / Prova / Correção)
- Evaluation pages now call `/api/correcao/*` instead of `/api/admin/avaliacao/*`
- New `ExamGuard` component wraps the prova page with anti-cheating enforcement
- API client updated in all 3 evaluation pages (admin/avaliacao, avaliador/fase2, comissao/avaliacao)

### Exam Security (ExamGuard)

The ExamGuard component (`frontend/src/components/exam/ExamGuard.tsx`) implements:

| Protection | Mechanism |
|------------|-----------|
| Fullscreen enforcement | Requests fullscreen on mount via Fullscreen API |
| Tab/visibility detection | `visibilitychange` listener increments warnings when page is hidden |
| Keyboard shortcut blocking | Prevents Ctrl+R, F5, Ctrl+Shift+R, Ctrl+W, Alt+F4 |
| Context menu prevention | Blocks right-click during exam |
| Copy prevention | Blocks Ctrl+C / copy events |
| Warning counter | 3 warnings max, displayed as red banner |
| Auto-submit | Finalizes exam via `/api/prova/finalizar` when limit exceeded |

**Limitation:** ExamGuard is entirely client-side JS — it cannot prevent dedicated cheating tools, external devices, or OS-level bypasses.

## Major Architectural Changes

### Database
- **4 models removed:** Modulo, ProgressoCurso, Certificado, Submissao (FORPEMAT/CONGEMAT domains)
- **2 enums removed:** TipoSubm, StatusSubm (CONGEMAT)
- **10 new models created:** Instituicao, Curso, CoordenadorCurso, Edicao, Prova, ProvaQuestao, EnvioFase2, AvaliacaoFase2, RankingSnapshot, AuditLog
- **2 new enums created:** StatusProva, StatusEnvioFase2
- **1 enum modified:** Role — added COORDENADOR_CURSO
- **Column renames:** User.senha → senhaHash, Resposta.alternativa → alternativaMarcada
- **FK normalization:** User and Inscricao `instituicao`/`curso` flat strings replaced by `instituicaoId`/`cursoId` FK references
- **Phase 2 normalization:** Inscricao.fase2VideoUrl/fase2PortfolioUrl/fase2Nota extracted to EnvioFase2/AvaliacaoFase2 entities
- **Migration:** Single clean migration `20260609131525_refactor_olicmat_v2`

### Backend
- **32 source files removed** (lms/ directory, congresso/ directory, dead scaffolding)
- **29 new source files created** (admin/, coordenacao/, instituicoes/ modules)
- **New route groups registered:** `/api/admin/*`, `/api/coordenacao/*`, `/api/instituicoes/*`
- **New endpoints:** 30+ new endpoints for exam management, question CRUD, Phase 2 evaluation, dashboards, exports, audit logging, coordinator views
- **Removed endpoints:** `/api/modulos`, `/api/certificados`, `/api/submissoes` (10 routes)
- **Auth expansion:** Added password recovery endpoints, /auth/me endpoint

### Frontend
- **3 routes removed:** `/cursos`, `/cursos/[moduloId]`, `/congresso`
- **19 new routes created:** Across competidor/resultado, coordenador/*, avaliador/*, admin/*, auth recovery, public pages
- **Total routes:** 28 (up from 12)
- **Landing page:** Updated Hero, Sobre, Cronograma to OLICMAT-only
- **Navigation:** Role-aware Sidebar with 4 distinct navigation menus
- **PWA:** manifest.json, meta tags, starter configuration
- **Route protection:** Added middleware.ts for server-side auth gating

---

## Removed Modules

| Module | Original Scope | Disposition |
|--------|---------------|-------------|
| `backend/src/lms/` | FORPEMAT LMS (modules, certificates) | Entirely deleted |
| `backend/src/congresso/` | CONGEMAT Congress (submissions) | Entirely deleted |
| `frontend/src/app/cursos/` | FORPEMAT module catalog | Entirely deleted |
| `frontend/src/app/congresso/` | CONGEMAT submission page | Entirely deleted |
| `Modulo`, `ProgressoCurso`, `Certificado`, `Submissao` (DB) | FORPEMAT/CONGEMAT | Dropped from schema |

---

## Schema/Migration Changes

| Change | Detail |
|--------|--------|
| Migration name | `20260609131525_refactor_olicmat_v2` |
| Strategy | Destructive rebuild (no production data) |
| Seed data | 3 institutions, 3 courses, 4 users (all roles), 1 edition, 5 questions, 1 exam, 1 enrollment |
| Seed config | `prisma.config.ts` with `migrations.seed` (Prisma 7.x); `prisma db seed` verified host + Docker |
| Future migrations | Incremental via `prisma migrate dev` |

---

## Route Changes

### Backend Routes Removed (10)
- GET/POST `/api/modulos/*` (4 routes)
- POST/GET `/api/certificados/*` (2 routes)
- POST/GET/PATCH `/api/submissoes/*` (4 routes)

### Backend Routes Added (30+, plus new correction module)
- `/api/correcao` (3 routes — extracted from admin/avaliacao to independent module)
- `/api/instituicoes` (4 routes)
- `/api/admin/provas` (7 routes)
- `/api/admin/questoes` (5 routes)
- `/api/admin/avaliacao` (deprecated — moved to `/api/correcao`)
- `/api/admin/dashboard` (2 routes)
- `/api/admin/auditoria` (1 route)
- `/api/coordenacao` (3 routes)
- `/api/auth/esqueci-senha`, `/api/auth/redefinir-senha`, `/api/auth/me` (3 routes)

### Frontend Routes Removed (3)
- `/cursos`, `/cursos/[moduloId]`, `/congresso`

### Frontend Routes Added (19)
- `/esqueci-senha`, `/redefinir-senha`
- `/regulamento`, `/sobre`
- `/competidor/resultado`
- `/coordenador`, `/coordenador/alunos`, `/coordenador/metricas`
- `/avaliador`, `/avaliador/provas`, `/avaliador/provas/[id]`, `/avaliador/fase2` (now calls `/api/correcao/*`)
- `/admin`, `/admin/usuarios`, `/admin/inscricoes`, `/admin/provas`, `/admin/avaliacao` (now calls `/api/correcao/*`), `/admin/exportar`, `/admin/auditoria`

---

## RBAC Changes

| Change | Detail |
|--------|--------|
| New role added | COORDENADOR_CURSO |
| Coordinator endpoints | 3 new endpoints guarded with COORDENADOR_CURSO role |
| Admin endpoints | 30+ new endpoints guarded with ADMIN (some shared with AVALIADOR) |
| Frontend role routing | Dashboard layout now redirects by role |
| Sidebar | 4 distinct navigation menus per role |

---

## Test Changes

| Area | Status |
|------|--------|
| Pre-existing tests | 1 stub test file (app.controller.spec.ts) — deleted with dead code |
| New tests | Documented test requirements, not yet implemented |
| Test strategy | See SRS_OLICMAT.md §8 for full test plan |

**Note (2026-07-02):** The refactor did not include writing new tests. The pre-existing codebase had zero meaningful tests. A comprehensive test suite covering auth, RBAC, enrollment, exam execution, Phase 2 evaluation, and ranking should be the next engineering priority. See the test matrix in SRS_OLICMAT.md for the complete list.

**Note (2026-07-06):** The 3-module refactor also did not add tests. The correction module endpoints (`/api/correcao/*`) must be tested separately from the old admin/avaliacao routes.

---

## Known Limitations

1. **Password recovery is placeholder:** Endpoints return success messages but don't actually send emails. Real email integration required.
2. **Instituicao/Curso autocomplete:** Frontend forms still use text inputs for institution/course on the registration page. Admin pages already use selects populated from the catalog endpoints.
3. **Service worker not implemented:** PWA has manifest and meta tags but no offline caching strategy.
4. **No pagination:** List endpoints return all records without limit/offset.
5. **No tests:** Zero test coverage. Critical flows need unit + integration tests.
6. **Export is basic CSV:** Single enrollment export. Results, users, and provas exports not yet implemented.
7. **No rate limiting:** Auth endpoints should have rate limiting for production.
8. **Middleware uses cookies:** The auth middleware reads `token` from cookies, but the app uses localStorage. This needs alignment (either use cookies for token storage, or remove server-side middleware and rely on client-side guards).
9. **ExamGuard is client-side only:** Cannot prevent dedicated cheating tools, external recording devices, or OS-level bypasses.
10. **Evaluation pages still duplicated:** `admin/avaliacao` (400 lines), `avaliador/fase2` (236 lines), and `comissao/avaliacao` (261 lines) share similar logic but are not extracted to a shared component. The next shared-component candidate after the 2026-07-07 DetailPanel release.
11. **ExamGuard auto-submit may 400:** Calls `/prova/finalizar` which may return 400 if exam is already finalized.
12. **Admin/avaliador exam editor duplicated:** Same ProvaDetalhePage logic exists in both admin and avaliador dashboards (~480 lines each).
13. **AuditLog not yet written:** The `AuditLog` table exists and endpoints work, but no backend code persists mutations into it. The Registration detail panel surfaces a friendly empty-state placeholder in the "Histórico" section until this is implemented.

> **Resolved in 2026-07-07 release:**
> - Ad-hoc detail modal pattern — replaced by the unified `<DetailPanel>` component.
> - Per-page `Row`/`SectionTitle`/`FieldGroup`/`DetailField` helpers — folded into `<DetailPanel>`.
> - Missing Course and Edition view screens — both shipped with Eye actions.
> - Hidden registration fields (`fase1Nota`, `fase2Tema`, `notaFinal`, `medalha`) — exposed in the expanded view.

---

## Next Recommended Engineering Steps

1. **Write tests** — Start with auth service, RBAC guards, and enrollment rules
2. **Implement email service** — Password recovery and email confirmation
3. **Complete PWA** — Add service worker with caching strategies
4. **Add pagination** — To all list endpoints
5. **Improve UX polish** — Loading skeletons, empty states, error boundaries
6. **Add rate limiting** — On auth endpoints
7. **Production Docker setup** — Multi-stage builds, non-root users, health checks
8. **CI/CD pipeline** — GitHub Actions for build, test, and deploy
9. **Align token storage** — Move from localStorage to httpOnly cookies for better security
10. **Institution/course autocomplete** — In enrollment and registration forms

---

## Deliverables Created

| File | Status |
|------|--------|
| `docs/refactor-audit.md` | ✅ Complete |
| `docs/refactor-plan.md` | ✅ Complete |
| `docs/refactor-summary.md` | ✅ This file |
| `docs/role-permissions-matrix.md` | ✅ Complete |
| `docs/api-surface.md` | ✅ Complete |
| `docs/database-migration-blueprint.md` | ✅ Complete |
| `docs/frontend-route-map.md` | ✅ Complete |
| `docs/refactor-checklist.md` | ✅ Complete |
| `docs/CHANGELOG.md` | ✅ New (2026-07-07) |
| `frontend/src/components/ui/detail-panel.tsx` | ✅ New (2026-07-07) — unified entity viewer |
| `frontend/src/components/ui/modal.tsx` | ✅ Extended (2026-07-07) — new `2xl`/`3xl` sizes + `headerActions` slot |
| `CLAUDE.md` (root) | ✅ Complete |
