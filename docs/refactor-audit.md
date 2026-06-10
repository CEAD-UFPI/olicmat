# Refactor Audit — OLICMAT v2.0

**Version:** 1.0
**Date:** 2026-06-09
**Status:** Phase 1 — Complete

---

## Executive Summary

This document presents the complete audit of the OLICMAT repository as of 2026-06-09. The audit covers the full stack: Prisma schema, database migrations, backend modules/routes/DTOS/guards, frontend routes/components/stores/forms, infrastructure, documentation, and all references to the obsolete FORPEMAT and CONGEMAT scopes.

**Key finding:** The codebase reflects the original three-pillar vision (OLICMAT competition + FORPEMAT training LMS + CONGEMAT academic congress). Approximately 40% of the models, 20% of the API surface, and 30% of the frontend routes are dedicated to FORPEMAT/CONGEMAT. These must be removed or isolated per the updated BRD/PRD/SRS_OLICMAT v2.0 documents, which declare FORPEMAT and CONGEMAT as explicitly out of scope.

---

## 1. Current Architecture Summary

### 1.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js (App Router) | 16.2.4 |
| Frontend Language | TypeScript | 5.x |
| UI Components | shadcn/base-ui, Lucide React, Tailwind CSS | 4.x |
| State Management | Zustand | 5.0.x |
| Form Validation | react-hook-form + zod | 7.75 / 4.4 |
| Backend Framework | NestJS | 11.x |
| Backend Language | TypeScript | 5.7.x |
| ORM | Prisma | 7.8.0 |
| Database | PostgreSQL | 16 (Docker) |
| Auth | Passport JWT, bcrypt | - |
| File Storage | Cloudinary | 2.x |
| Containerization | Docker + Docker Compose | - |

### 1.2 Repository Structure

```
olicmat/
├── frontend/                    # Next.js 16 App Router
│   ├── src/
│   │   ├── app/                 # Routes (App Router)
│   │   │   ├── layout.tsx       # Root layout (Header + Footer)
│   │   │   ├── page.tsx         # Landing page (/)
│   │   │   ├── (auth)/          # Auth route group (login, registro)
│   │   │   ├── (dashboard)/     # Protected route group
│   │   │   │   ├── layout.tsx   # Auth guard + Sidebar wrapper
│   │   │   │   └── competidor/  # Competitor pages
│   │   │   ├── cursos/          # FORPEMAT module catalog
│   │   │   ├── congresso/       # CONGEMAT submission page
│   │   │   └── ranking/         # Public ranking
│   │   ├── components/
│   │   │   ├── landing/         # Hero, Sobre, Cronograma, Parceiros
│   │   │   ├── layout/          # Header, Sidebar, Footer
│   │   │   ├── prova/           # QuestaoCard, Timer
│   │   │   └── ui/              # shadcn components
│   │   ├── stores/              # Zustand stores (auth, prova)
│   │   ├── lib/                 # API client, utils
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets (no PWA manifest)
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── app.module.ts        # Root NestJS module
│   │   ├── main.ts              # Bootstrap (CORS, ValidationPipe, prefix)
│   │   ├── prisma.service.ts    # PrismaClient singleton
│   │   ├── auth/                # Authentication module
│   │   ├── users/               # User profile module
│   │   ├── olimpiada/           # OLICMAT domain module
│   │   │   ├── inscricao/       # Competition registration
│   │   │   ├── prova/           # Exam execution
│   │   │   ├── envio/           # Phase 2 file uploads
│   │   │   └── ranking/         # Ranking and medals
│   │   ├── lms/                 # FORPEMAT LMS module (TO REMOVE)
│   │   ├── congresso/           # CONGEMAT congress module (TO REMOVE)
│   │   ├── upload/              # Cloudinary upload service
│   │   └── common/              # Guards, decorators
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.ts              # Seed data (FORPEMAT-only)
│   │   └── migrations/          # Single initial migration
│   └── package.json
├── docs/
│   ├── PRD_OLICMAT.md           # SOURCE OF TRUTH — Product Requirements
│   ├── BRD_OLICMAT.md           # SOURCE OF TRUTH — Business Requirements
│   ├── SRS_OLICMAT.md           # SOURCE OF TRUTH — System Requirements
│   ├── BRD.md                   # OBSOLETE — Original three-pillar BRD
│   ├── PRD.md                   # OBSOLETE — Original three-pillar PRD
│   └── SRS.md                   # OBSOLETE — Original three-pillar SRS
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 2. Current Domain Model Inventory

### 2.1 Prisma Models — Complete List

| Model | Domain | Status |
|-------|--------|--------|
| **User** | Shared (Auth) | KEEP — needs field modifications |
| **Inscricao** | OLICMAT | KEEP — needs field modifications |
| **Questao** | OLICMAT | KEEP AS-IS |
| **Resposta** | OLICMAT | KEEP — minor field renames |
| **Modulo** | FORPEMAT | REMOVE |
| **ProgressoCurso** | FORPEMAT | REMOVE |
| **Certificado** | FORPEMAT | REMOVE |
| **Submissao** | CONGEMAT | REMOVE |

### 2.2 Prisma Enums — Complete List

| Enum | Values | Domain | Status |
|------|--------|--------|--------|
| **Role** | ALUNO, AVALIADOR, ADMIN | Shared | MODIFY — add COORDENADOR_CURSO |
| **StatusInsc** | PENDENTE, CONFIRMADA, REJEITADA | OLICMAT | KEEP |
| **Medalha** | OURO, PRATA, BRONZE | OLICMAT | KEEP |
| **Eixo** | ALGEBRA, GEOMETRIA, ANALISE, ESTATISTICA, DIDATICA | OLICMAT | KEEP |
| **Dificuldade** | FACIL, MEDIO, DIFICIL | OLICMAT | KEEP |
| **TipoSubm** | ARTIGO, POSTER | CONGEMAT | REMOVE |
| **StatusSubm** | EM_AVALIACAO, APROVADO, REJEITADO | CONGEMAT | REMOVE |

### 2.3 Missing Models (Required by SRS_OLICMAT v2.0)

| Model | Priority | Key Fields |
|-------|----------|------------|
| **Instituicao** | P0 | id, nome, sigla, estado |
| **Curso** | P0 | id, nome, instituicaoId |
| **CoordenadorCurso** | P0 | id, userId, cursoId |
| **Edicao** | P0 | id, ano, titulo, status, datas |
| **Prova** | P0 | id, edicaoId, fase, titulo, duracaoMinutos, status, janelas |
| **ProvaQuestao** | P0 | id, provaId, questaoId, ordem |
| **EnvioFase2** | P0 | id, inscricaoId, tipo, arquivoUrl, status |
| **AvaliacaoFase2** | P0 | id, inscricaoId, avaliadorId, nota, parecer |
| **RankingSnapshot** | P1 | id, edicaoId, estado, dados (JSON) |
| **AuditLog** | P1 | id, actorId, acao, entidade, entidadeId, payload |

### 2.4 Field Mismatches — Existing Models vs SRS_OLICMAT

**User model:**
- `senha` → should be `senhaHash`
- `instituicao: String` → should be `instituicaoId` (FK to Instituicao)
- `curso: String` → should be `cursoId` (FK to Curso)
- Missing `COORDENADOR_CURSO` in Role enum
- Has dead relations: `submissoes`, `progressoCursos`, `certificados`

**Inscricao model:**
- Missing `edicaoId` FK (no multi-edition support)
- `instituicao: String` → should be `instituicaoId` FK
- `curso: String` → should be `cursoId` FK
- `fase2VideoUrl`, `fase2PortfolioUrl`, `fase2Nota` → should be migrated to EnvioFase2 / AvaliacaoFase2 entities
- `fase1Inicio`, `fase1Fim` → belong on Prova execution session, not registration

**Resposta model:**
- `alternativa` → should be `alternativaMarcada`
- Missing `provaId` FK
- Missing `updatedAt`

---

## 3. Current API Surface

### 3.1 Backend Route Inventory

#### Auth (`/api/auth`) — KEEP
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/auth/registro` | Public | — | Register new user |
| POST | `/auth/login` | Public | — | Login, returns JWT |

#### Users (`/api/users`) — MODIFY (add admin endpoints)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/users/me` | JWT | — | Get current user profile |

#### Inscricao (`/api/inscricoes`) — MODIFY (add admin routes)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/inscricoes` | JWT | — | Create inscription |
| GET | `/inscricoes/minha` | JWT | — | Get my inscription |
| POST | `/inscricoes/minha/iniciar-prova` | JWT | — | Start Phase 1 exam |
| POST | `/inscricoes/minha/sortear-tema` | JWT | — | Draw Phase 2 theme |
| GET | `/inscricoes` | JWT | ADMIN, AVALIADOR | List all inscriptions |
| PATCH | `/inscricoes/:id/confirmar` | JWT | ADMIN, AVALIADOR | Confirm inscription |

#### Prova (`/api/prova`) — MODIFY (add admin exam CRUD)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/prova/questoes` | JWT | — | Get random questions for exam |
| POST | `/prova/responder` | JWT | — | Submit answer |
| POST | `/prova/finalizar` | JWT | — | Finish exam, compute score |
| GET | `/prova/resumo` | JWT | — | Get exam summary |

#### Envio (`/api/envio`) — REFACTOR (generalize from video/portfolio)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/envio/video` | JWT | — | Upload Phase 2 video |
| POST | `/envio/portfolio` | JWT | — | Upload Phase 2 portfolio |
| GET | `/envio/status` | JWT | — | Get submission status |

#### Ranking (`/api/ranking`) — KEEP, minor modifications
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/ranking` | Public | — | Get ranking by state |
| POST | `/ranking/atualizar-medalhas` | JWT | ADMIN | Compute medals |

#### Modulos (`/api/modulos`) — REMOVE (FORPEMAT)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/modulos` | JWT | — | List modules |
| GET | `/modulos/progresso` | JWT | — | User progress |
| GET | `/modulos/:id` | JWT | — | Module detail |
| POST | `/modulos/:id/concluir` | JWT | — | Complete module |

#### Certificados (`/api/certificados`) — REMOVE (FORPEMAT)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/certificados/emitir` | JWT | — | Issue certificate |
| GET | `/certificados` | JWT | — | List certificates |

#### Submissoes (`/api/submissoes`) — REMOVE (CONGEMAT)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/submissoes` | JWT | — | Submit paper/poster |
| GET | `/submissoes/minhas` | JWT | — | List my submissions |
| GET | `/submissoes` | JWT | ADMIN, AVALIADOR | List all submissions |
| PATCH | `/submissoes/:id` | JWT | ADMIN, AVALIADOR | Update status |

### 3.2 Missing API Endpoints (Required by SRS_OLICMAT)

**Auth:**
- `POST /auth/esqueci-senha`
- `POST /auth/redefinir-senha`
- `GET /auth/me`

**Admin Users:**
- `GET /admin/users`
- `PATCH /admin/users/:id/role`

**Admin Inscriptions:**
- `PATCH /admin/inscricoes/:id/rejeitar`

**Admin Provas (Exam Management):**
- `POST /admin/provas`
- `GET /admin/provas`
- `GET /admin/provas/:id`
- `PATCH /admin/provas/:id`
- `POST /admin/provas/:id/publicar`
- `POST /admin/provas/:id/duplicar`
- `POST /admin/provas/:id/questoes`
- `PATCH /admin/questoes/:id`
- `DELETE /admin/questoes/:id`

**Phase 1 Execution:**
- `POST /olimpiada/prova/iniciar`
- `GET /olimpiada/prova/status`

**Phase 2:**
- `GET /olimpiada/fase2/tema`
- `POST /olimpiada/fase2/upload`
- `GET /olimpiada/fase2/status`

**Evaluation:**
- `POST /avaliacao/fase2/:id/nota`

**Ranking (extended):**
- `GET /ranking/instituicao`
- `GET /ranking/curso`
- `POST /admin/resultados/publicar`

**Coordinator:**
- `GET /coordenacao/alunos`
- `GET /coordenacao/inscricoes`
- `GET /coordenacao/metricas`

**Admin:**
- `GET /admin/dashboard`
- `GET /admin/export/csv`
- `GET /admin/auditoria`

---

## 4. Authentication & RBAC Audit

### 4.1 Current State

- **JWT-based auth**: Passport JWT strategy, 1-hour token expiry
- **Role enum**: ALUNO, AVALIADOR, ADMIN
- **Missing role**: COORDENADOR_CURSO (required by SRS_OLICMAT)
- **Guards**: `JwtAuthGuard` + `RolesGuard` with `@Roles()` decorator
- **Default role**: ALUNO (all new users)
- **Token payload**: `{ sub: userId, email, role }`

### 4.2 RBAC Usage Map

| Endpoint | Roles |
|----------|-------|
| POST `/inscricoes` | Any authenticated |
| GET `/inscricoes/minha` | Any authenticated |
| GET `/inscricoes` | ADMIN, AVALIADOR |
| PATCH `/inscricoes/:id/confirmar` | ADMIN, AVALIADOR |
| POST `/ranking/atualizar-medalhas` | ADMIN |
| GET `/submissoes` | ADMIN, AVALIADOR |
| PATCH `/submissoes/:id` | ADMIN, AVALIADOR |

### 4.3 RBAC Gaps

- No frontend role-based route gating (only authentication check)
- No role-specific dashboard routing
- COORDENADOR_CURSO role does not exist in code or DB
- No coordinator-specific API endpoints
- No admin user management endpoints
- No evaluator exam management endpoints

---

## 5. Frontend Audit

### 5.1 Complete Route Map

| Route | File | Auth | Role Gate | Status |
|-------|------|------|-----------|--------|
| `/` | `app/page.tsx` | Public | — | KEEP (Landing) |
| `/login` | `app/(auth)/login/page.tsx` | Public | — | KEEP |
| `/registro` | `app/(auth)/registro/page.tsx` | Public | — | KEEP |
| `/ranking` | `app/ranking/page.tsx` | Public | — | KEEP |
| `/cursos` | `app/cursos/page.tsx` | Public | — | REMOVE (FORPEMAT) |
| `/cursos/[moduloId]` | `app/cursos/[moduloId]/page.tsx` | Public | — | REMOVE (FORPEMAT) |
| `/congresso` | `app/congresso/page.tsx` | Public | — | REMOVE (CONGEMAT) |
| `/competidor` | `app/(dashboard)/competidor/page.tsx` | JWT | — | KEEP (modify) |
| `/competidor/inscricao` | `app/(dashboard)/competidor/inscricao/page.tsx` | JWT | — | KEEP |
| `/competidor/prova` | `app/(dashboard)/competidor/prova/page.tsx` | JWT | — | KEEP |
| `/competidor/envio` | `app/(dashboard)/competidor/envio/page.tsx` | JWT | — | KEEP (modify) |

### 5.2 Missing Frontend Routes (Required by SRS_OLICMAT)

| Route | Purpose |
|-------|---------|
| `/coordenador` | Coordinator dashboard |
| `/coordenador/alunos` | Student list by course |
| `/admin` | Admin dashboard |
| `/admin/usuarios` | User management |
| `/admin/inscricoes` | Enrollment validation |
| `/admin/provas` | Exam management |
| `/admin/provas/[id]` | Exam detail/edit |
| `/admin/provas/[id]/questoes` | Question management |
| `/admin/dashboard` | Operational metrics |
| `/avaliador` | Evaluator dashboard |
| `/avaliador/fase2` | Phase 2 evaluation |

### 5.3 Component Inventory

| Component | Status |
|-----------|--------|
| `landing/Hero.tsx` | MODIFY — tagline references "formação e congresso" |
| `landing/Sobre.tsx` | MODIFY — three-pillar cards need to become OLICMAT-only |
| `landing/Cronograma.tsx` | MODIFY — references FORPEMAT and CONGEMAT events |
| `landing/Parceiros.tsx` | KEEP |
| `layout/Header.tsx` | KEEP |
| `layout/Sidebar.tsx` | MODIFY — needs role-based links |
| `layout/Footer.tsx` | MODIFY — two of three columns are FORPEMAT/CONGEMAT |
| `prova/QuestaoCard.tsx` | KEEP |
| `prova/Timer.tsx` | KEEP |
| `ui/*` | KEEP (shadcn components) |
| `theme-provider.tsx` | KEEP |

### 5.4 Store Inventory

| Store | Status |
|-------|--------|
| `authStore.ts` | MODIFY — add role-based routing helpers |
| `provaStore.ts` | KEEP — already well-structured |

### 5.5 Form Coverage

| Form | Library | Status |
|------|---------|--------|
| Login | react-hook-form + zod | KEEP |
| Registration (2-step) | react-hook-form + zod | KEEP |
| Inscricao | react-hook-form + zod | KEEP |
| Congresso submission | useState only | REMOVE |
| Modulo quiz | useState only | REMOVE |

### 5.6 PWA Readiness

- **No manifest.json** exists anywhere
- **No service worker** files exist
- **No PWA meta tags** in the root layout
- The PRD_OLICMAT requires PWA support — this is completely unimplemented

### 5.7 Navigation / UX

- **Sidebar**: Only shows competitor links (no role-aware navigation)
- **Header**: Shows "Dashboard" link that always goes to `/competidor` regardless of role
- **No middleware.ts**: Route protection is entirely client-side in `(dashboard)/layout.tsx`
- **Many dead footer links**: All `#` placeholder links
- **No role-based redirect**: All authenticated users land on the same competitor dashboard

---

## 6. Migration & Seed Audit

### 6.1 Migrations

- **Only one migration**: `20260506015847_init`
- Monolithic initial migration creating all tables at once
- Contains DDL for FORPEMAT tables (Modulo, ProgressoCurso, Certificado) and CONGEMAT tables (Submissao)
- No production data to migrate (pre-production codebase)

### 6.2 Seed File

- **Entirely FORPEMAT-focused**: Seeds 14 pedagogical training modules
- Contains explicit reference: `"Iniciando seed dos módulos FORPEMAT..."`
- No OLICMAT seed data exists (no test users, no questions, no editions, no institutions)
- Must be completely rewritten for OLICMAT scope

---

## 7. Infrastructure & Config Audit

### 7.1 Docker Setup

- Three services: postgres, backend, frontend
- Development-oriented (Dockerfile.dev, volume mounts, hot reload)
- Container names: `olicmat-db`, `olicmat-api`, `olicmat-web`
- No production Dockerfile configurations
- No load balancing or scaling configuration

### 7.2 Environment Variables

| Variable | Default | Notes |
|----------|---------|-------|
| DATABASE_URL | `postgresql://olicmat:olicmat_dev@localhost:5433/olicmat` | Dev only |
| JWT_SECRET | `change_this_to_a_random_secret` | Insecure default |
| CLOUDINARY_CLOUD_NAME | — | Required for uploads |
| CLOUDINARY_API_KEY | — | Required for uploads |
| CLOUDINARY_API_SECRET | — | Required for uploads |
| NEXT_PUBLIC_API_URL | `http://localhost:3333` | Frontend API base |
| PORT | 3333 | Backend port |

### 7.3 Cloudinary Configuration

- Root folder for all uploads: `olicmat/`
- Congresso uploads incorrectly use: `congemat/${userId}` (bug)
- Upload service is shared infrastructure, well-isolated

---

## 8. Complete FORPEMAT/CONGEMAT Reference Inventory

### 8.1 Backend — Files to Remove Entirely

```
backend/src/lms/lms.module.ts
backend/src/lms/modulos/modulo.controller.ts
backend/src/lms/modulos/modulo.service.ts
backend/src/lms/certificado/certificado.controller.ts
backend/src/lms/certificado/certificado.service.ts
backend/src/lms/progresso/                    # Empty directory
backend/src/congresso/congresso.module.ts
backend/src/congresso/submissao/submissao.controller.ts
backend/src/congresso/submissao/submissao.service.ts
```

### 8.2 Backend — Imports to Remove

```
backend/src/app.module.ts: lines 6, 7, 15, 16 (LmsModule, CongressoModule)
```

### 8.3 Prisma Schema — Models and Enums to Remove

```
Models: Modulo, ProgressoCurso, Certificado, Submissao
Enums: TipoSubm, StatusSubm
Relations on User: submissoes, progressoCursos, certificados
```

### 8.4 Seed — Complete Rewrite

```
backend/prisma/seed.ts — Entire file replaced
```

### 8.5 Frontend — Pages to Remove

```
frontend/src/app/cursos/page.tsx
frontend/src/app/cursos/[moduloId]/page.tsx
frontend/src/app/congresso/page.tsx
frontend/src/app/cursos/                  # Entire directory
frontend/src/app/congresso/               # Entire directory
```

### 8.6 Frontend — Components Needing Modification

| File | Lines | Content to Change |
|------|-------|-------------------|
| `landing/Hero.tsx` | 135-136 | Tagline: "Competição, formação e congresso..." → OLICMAT-only |
| `landing/Sobre.tsx` | 18-32 | Three eixo cards → single OLICMAT focus |
| `landing/Cronograma.tsx` | 29-38 | Remove FORPEMAT and CONGEMAT timeline events |
| `layout/Footer.tsx` | 14-28 | Remove FORPEMAT and CONGEMAT columns |
| `competidor/page.tsx` | 60-61 | CTA text references FORPEMAT + CONGEMAT |
| `app/layout.tsx` | 30 | Meta description references formação + congresso |
| `app/page.tsx` | 9 | Meta description references formação + congresso |

### 8.7 Documentation — Obsolete Files

```
docs/BRD.md (v1.0 — three-pillar)
docs/PRD.md (v1.0 — three-pillar)
docs/SRS.md (v1.0 — three-pillar)
```

### 8.8 Other Code References

| File | Line | Issue |
|------|------|-------|
| `backend/src/congresso/submissao/submissao.service.ts` | 18 | Cloudinary path `congemat/${userId}` |
| `backend/prisma/seed.ts` | 29 | Console log `"módulos FORPEMAT"` |
| `scripts/gerar_apresentacao.py` | Multiple | FORPEMAT/CONGEMAT in presentation generator |

---

## 9. Technical Debt & Cleanup Opportunities

### 9.1 Empty Directories

```
backend/src/common/filters/          # Empty — no exception filters
backend/src/common/interceptors/     # Empty — no interceptors
backend/src/lms/progresso/           # Empty — stub directory
```

### 9.2 Dead Code

| File | Issue |
|------|-------|
| `backend/src/app.controller.ts` | Defined but NOT registered in AppModule |
| `backend/src/app.service.ts` | Defined but NOT registered in AppModule |
| `backend/src/olimpiada/inscricao/dto/inscricao.dto.ts` | `atualizarInscricaoSchema` is defined but never imported/used |

### 9.3 Code Quality Issues

- **No global PrismaService**: Each module creates its own provider; while DI caches the instance, marking it `@Global()` would be safer
- **No request logging**: No interceptors for request/response logging
- **No exception filters**: Errors handled ad-hoc in services/controllers
- **Forms inconsistent**: Two of five forms use raw `useState` instead of react-hook-form+zod
- **No TypeScript strict mode**: `tsconfig.json` should be audited for strictness
- **No frontend middleware**: Route protection is client-side only; no `middleware.ts`
- **No role-based routing**: All authenticated users see the same sidebar and dashboard

### 9.4 Testing Debt

- Only one test file exists: `backend/src/app.controller.spec.ts` (stub)
- No unit tests for auth, RBAC, enrollment, exam execution, ranking
- No integration tests
- No e2e tests beyond the default NestJS scaffold
- No frontend tests whatsoever

---

## 10. Migration Risk Assessment

### 10.1 Low-Risk Operations

- Removing FORPEMAT/CONGEMAT frontend pages (no auth dependency)
- Updating footer/sidebar/landing text (pure UI)
- Removing empty directories (no impact)
- Updating obsolete docs (no runtime impact)

### 10.2 Medium-Risk Operations

- Removing backend LMS/Congresso modules (need to update app.module.ts carefully)
- Modifying Prisma schema (need new migration)
- Rewriting seed file (no production data impact)
- Adding new models (schema extension, not breaking change for existing models at first)

### 10.3 High-Risk Operations

- Renaming existing columns (`senha` → `senhaHash`, `alternativa` → `alternativaMarcada`) — requires migration with data safety checks
- Changing `instituicao`/`curso` from String to FK — requires data migration to new tables
- Removing `fase2VideoUrl`/`fase2PortfolioUrl`/`fase2Nota` from Inscricao — data migration needed

### 10.4 Recommended Approach

Since there is only one initial migration and no production database, the safest approach is:
1. **Create a clean migration** that drops FORPEMAT/CONGEMAT tables and adds new OLICMAT tables
2. **Rename and modify columns in-place** with a single migration (no historical data to preserve)
3. **Reset dev databases** after migration — inform all developers to `prisma migrate reset`

---

## 11. Audit Conclusion

The codebase is a well-structured but partial implementation of the original three-pillar OLICMAT+FORPEMAT+CONGEMAT vision. It has:

- **Solid technical foundations**: NestJS + Next.js 16 + Prisma + TypeScript
- **Good patterns**: Zod validation, react-hook-form, Zustand, JWT auth with guards
- **Clear but outdated domain model**: 8 models, 4 of which serve the old scope
- **Partial OLICMAT implementation**: Enrollment, Phase 1 exam, Phase 2 upload, ranking exist
- **No exam management domain**: Prova entity, question CRUD, exam publishing workflow missing
- **No coordinator experience**: COORDENADOR_CURSO role and all coordinator endpoints missing
- **No admin operations**: User management, enrollment validation flow, dashboards, exports missing
- **No PWA**: Despite being required by PRD
- **No tests**: Only a single stub test file

The refactor must remove ~40% of the schema, ~20% of the API surface, and ~30% of the frontend routes, while building out missing OLICMAT domains. The next step is the detailed refactor plan (Phase 2).
