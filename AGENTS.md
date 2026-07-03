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
│   │   ├── olimpiada/   # Core: inscricao, prova, envio, ranking
│   │   ├── admin/       # Admin: provas, questoes, avaliacao, dashboard, auditoria
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
│   │   ├── components/         # layout/, landing/, prova/, ui/
│   │   ├── stores/             # Zustand (authStore, provaStore)
│   │   ├── lib/                # API client (Axios), utils
│   │   ├── types/              # TypeScript interfaces
│   │   └── middleware.ts       # Auth middleware (token check)
│   └── Dockerfile
├── docs/                # PRD, BRD, SRS, refactor plans
├── docker-compose.yml
└── docker-compose.prod.yml
```

## Roles

| Role | Dashboard | Description |
|------|-----------|-------------|
| ALUNO | `/competidor` | Register, enroll, take exams, Phase 2 |
| COORDENADOR_CURSO | `/coordenador` | View students, monitor enrollments |
| AVALIADOR | `/avaliador` | Create questions, manage exams, evaluate Phase 2 |
| ADMIN | `/admin` | Full access: users, enrollments, exams, exports, audit |

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
10. **Medal emoji** — Fixed display (was showing "1"/"2"/"3" instead of medal emojis)
11. **Inscription form** — Added comprovante de matrícula upload
12. **Dead deps** — Removed class-validator, class-transformer, @types/multer

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
| admin/avaliador Phase 2 evaluation duplicated | P1 | Same grouping/grading logic in both |
| No server-side role enforcement | P2 | Middleware only checks token; roles enforced client-side |
| Forced dark mode | P2 | No light theme support; hex values everywhere instead of CSS vars |
| Instituicao/Curso text inputs | P2 | Should be autocomplete dropdowns from API |
| No test infrastructure | P2 | No test runner configured |
| PWA manifest icons empty | P2 | `manifest.json` generated but `icons: []` |
| Header Dashboard link hardcoded | P2 | Points to `/competidor` for all users |
| `eslint-disable` comments | P3 | 4 suppressions in the codebase |
