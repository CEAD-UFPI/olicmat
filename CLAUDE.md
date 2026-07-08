# CLAUDE.md — OLICMAT v2.0

**Last updated:** 2026-07-07
**After:** Refactor from three-pillar (OLICMAT+FORPEMAT+CONGEMAT) to OLICMAT-only platform; subsequent 3-module split (2026-07-06) and DetailPanel + ENADE work (2026-07-07)

---

## Project Purpose

OLICMAT is a full-stack web platform for managing the Olimpíada para Licenciandos em Matemática — a nationwide competition for Mathematics Education undergraduate students in Brazil.

The platform covers the complete olympiad lifecycle: registration, enrollment validation, exam management, timed Phase 1 exam execution, Phase 2 submission handling, evaluation, ranking, medals, and administrative dashboards.

---

## Active Business Scope

- **OLICMAT competition** — enrollment, exam, Phase 2, ranking, medals
- **Roles:** ALUNO (student), COORDENADOR_CURSO (course coordinator), AVALIADOR (evaluator), ADMIN (administrator)
- **Responsive web + PWA** for mobile access

### Out of Scope (Removed — Do Not Reintroduce)

- **FORPEMAT** — pedagogical training LMS (14 modules, certificates)
- **CONGEMAT** — academic congress (article/poster submissions)
- These were fully removed during the v2.0 refactor. Do not reintroduce models, routes, pages, or references.

---

## Architecture Overview

```
Frontend:  Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/base-ui + Zustand
Backend:   NestJS 11 (modular monolith) + Zod validation + Passport JWT
Database:  PostgreSQL 16 via Prisma 7.8 ORM
Storage:   Cloudinary (comprovantes, Phase 2 uploads)
Infra:     Docker Compose (postgres, backend, frontend)
```

### Directory Structure

```
frontend/src/
  app/                  # Next.js App Router pages
    (auth)/             # Login, registro, password recovery
    (dashboard)/        # Role-protected routes (competidor, coordenador, avaliador, admin)
    (public)/           # Public pages (regulamento, sobre)
    ranking/            # Public ranking
  components/
    landing/            # Hero, Sobre, Cronograma, Parceiros
    layout/             # Header, Sidebar, Footer
    prova/              # QuestaoCard, Timer
    ui/                 # shadcn components (button, card, input, label, tabs, separator)
  stores/               # Zustand (authStore, provaStore)
  lib/                  # API client (Axios), utils
  types/                # TypeScript interfaces

backend/src/
  auth/                 # Registration, login, password recovery, JWT strategy
  users/                # User profile, admin user management
  olimpiada/            # Core competition (inscricao, prova, envio, ranking)
  admin/                # Administrative operations (provas, questoes, avaliacao, dashboard, auditoria)
  coordenacao/          # Coordinator views
  instituicoes/         # Institution and course catalog
  upload/               # Cloudinary file uploads
  common/               # Guards (JWT, Roles), decorators (@Roles)
```

---

## Core Domain Entities

| Entity | Purpose |
|--------|---------|
| **User** | System user with role (ALUNO, COORDENADOR_CURSO, AVALIADOR, ADMIN) |
| **Instituicao** | University/institution (nome, sigla, estado) |
| **Curso** | Course within an institution. **Field added 2026-07-07:** `notaEnade Decimal?(5,2)` — the ENADE score for the course (0–100, nullable) |
| **CoordenadorCurso** | Links a coordinator user to their course(s) |
| **Edicao** | Edition of the olympiad (year, weights, dates) |
| **Inscricao** | Student enrollment in an edition (status: PENDENTE, CONFIRMADA, REJEITADA) |
| **Prova** | Exam for a phase (status: RASCUNHO, PUBLICADA, EM_ANDAMENTO, ENCERRADA) |
| **Questao** | Question with 5 alternatives, correct answer, eixo, dificuldade |
| **ProvaQuestao** | Links questions to exams with ordering |
| **Resposta** | Student answer to a question during exam |
| **EnvioFase2** | Phase 2 file submission |
| **AvaliacaoFase2** | Evaluator's grade for Phase 2 |
| **RankingSnapshot** | Published ranking data |
| **AuditLog** | Audit trail for critical actions |

---

## Role Model

| Role | Dashboard | Key Capabilities |
|------|-----------|-----------------|
| ALUNO | /competidor | Register, enroll, take exams, submit Phase 2, view results |
| COORDENADOR_CURSO | /coordenador | View students by course, monitor enrollment status, metrics |
| AVALIADOR | /avaliador | Create/edit questions, manage exams (draft), evaluate Phase 2 |
| ADMIN | /admin | Everything: user management, enrollment validation, exam publishing, exports, audit |

---

## Coding Conventions

### Backend (NestJS)
- **Validation:** Zod schemas with `safeParse()` in controllers; throw `BadRequestException`
- **Auth:** `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`
- **Imports:** ESM with `.js` extensions; Prisma from `"../../generated/prisma/client.js"`
- **DTOs:** Zod-inferred types exported alongside schemas
- **Naming:** Portuguese for domain concepts (inscricao, prova, questao); English for technical terms
- **One module per domain** with controller, service, module file

### Frontend (Next.js)
- **Forms:** react-hook-form + zod + @hookform/resolvers
- **Styling:** Tailwind v4 with dark theme (bg-[#0a0a0f], text-[#f0ece4], accent #E8B829); readibility-tuned utility classes (`detail-label`, `detail-value`, `section-title`, `metric-value`, `metric-label`, `data-badge`) in `globals.css`
- **State:** Zustand stores (authStore for user/token, provaStore for exam state)
- **API:** Axios instance in lib/api.ts with Bearer token interceptor
- **Naming:** Portuguese for user-facing labels; TypeScript interfaces in types/index.ts
- **Entity detail views:** Use the unified `<DetailPanel>` component at `components/ui/detail-panel.tsx` (built on top of `<Modal>`). Detail panels ship with a hero KPI slot, labeled sections, semantic-color `StatusBadge`, `InlineList` and `EmptyState` widgets — see `docs/CHANGELOG.md` for the full contract

---

## Migration Safety Rules

1. **Never edit an applied migration** — create a new one with `prisma migrate dev`
2. **Test migrations with seed data** before deploying
3. **Backup the database** before applying migrations in production
4. **Reset flow** (dev only): `docker exec olicmat-db psql -U olicmat -d olicmat -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"` then `prisma migrate dev`
5. **Keep schema.prisma as the single source of truth** for the data model

---

## Test Expectations

- **Unit tests:** Auth service, enrollment rules, exam auto-correction, ranking computation
- **Integration tests:** Complete enrollment flow, exam execution flow, Phase 2 evaluation
- **Auth guard tests:** Role-based access verification for each endpoint
- **Frontend:** Form validation, timer behavior, role-based route protection
- See SRS_OLICMAT.md §8 for the full test requirements list

---

## Refactor Guardrails

**To prevent FORPEMAT/CONGEMAT logic from leaking back:**

1. Do not create models, routes, pages, or references to:
   - `Modulo`, `ProgressoCurso`, `Certificado`, `Submissao`
   - `/cursos`, `/congresso`, `/modulos`, `/certificados`, `/submissoes`
   - Terms "FORPEMAT", "CONGEMAT", "formação pedagógica", "congresso acadêmico"
2. If domain logic is unclear, consult:
   - `docs/PRD_OLICMAT.md`
   - `docs/BRD_OLICMAT.md`
   - `docs/SRS_OLICMAT.md`
3. The active scope is OLICMAT ONLY. No LMS, no congress, no pedagogical training modules.

---

## How to Use Subagents

- **Parallel audits:** Launch separate Explore agents for backend, frontend, schema, and reference sweeps
- **Heavy refactors:** Use general-purpose agents for multi-file backend/frontend changes
- **Verification:** Use independent agents to review changes before committing
- **Documentation:** Generate docs using agent synthesis of implemented state

## How to Use Available Skills

- `superpowers:brainstorming` — For design decisions before implementation
- `superpowers:writing-plans` — For complex multi-step implementation plans
- `superpowers:executing-plans` — For systematic plan execution
- `superpowers:verification-before-completion` — Verify changes work before declaring done
- `frontend-design` — For UI component design
- `webapp-testing` — For frontend testing
