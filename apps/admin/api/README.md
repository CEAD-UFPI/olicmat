# OLICMAT Backend — NestJS API

The NestJS 11 (TypeScript, ESM) backend for the OLICMAT platform. Provides
JWT authentication, RBAC, Prisma 7.8 ORM access to PostgreSQL 16, and
modular endpoints for the 3-module operational split
(Config/Results · Exam · Correction).

> See `../README.md` for the full-stack overview and `../docs/` for
> the PRD / BRD / SRS / API surface / migration blueprint.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 20+ |
| Framework | NestJS 11 (ESM) |
| Database | PostgreSQL 16 via Prisma 7.8 |
| Auth | Passport JWT + RBAC (`@Roles` decorator + `RolesGuard`) |
| Validation | Zod (controllers throw `BadRequestException` on parse failure) |
| Storage | Cloudinary (via `upload/` module) |

## Source Layout

```
src/
├── auth/             # Register, login, password recovery, JWT strategy
├── users/            # Profile + admin user management
├── olimpiada/        # Module 1+2 — inscricao, prova (isolated), envio, ranking
├── admin/            # Module 1 — provas, questoes, dashboard, auditoria, cursos, edicoes, instituicoes, usuarios
├── correcao/         # Module 3 — Phase 2 evaluation (extracted from admin)
├── coordenacao/      # Coordinator views
├── instituicoes/     # Public institution/course catalog
├── upload/           # Cloudinary upload service
├── common/           # JwtAuthGuard, RolesGuard, @Roles decorator
├── prisma.service.ts # Global PrismaModule singleton
├── app.module.ts
└── main.ts
```

## Data Model Highlights

- 5 roles: ALUNO, COORDENADOR_CURSO, AVALIADOR, ADMIN, COMISSAO
- Core entities: User, Instituicao, Curso, Edicao, Inscricao, Prova,
  Questao, ProvaQuestao, Resposta, EnvioFase2, AvaliacaoFase2,
  RankingSnapshot, AuditLog
- **Curso** has an optional `notaEnade Decimal(5,2)` field
  (added 2026-07-07) — the ENADE score for the course (0–100).
- See `prisma/schema.prisma` for the authoritative definition and
  `../docs/database-migration-blueprint.md` for the change history.

## Development

```bash
npm install
cp .env.example .env  # configure DATABASE_URL, JWT_SECRET
npx prisma migrate deploy
npm run start:dev      # http://localhost:3333/api
```

## Role Expectations per `../AGENTS.md`

- Validation: Zod with `safeParse()` in controllers
- Auth: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`
- Imports: ESM with `.js` extensions; Prisma client from
  `"../../generated/prisma/client.js"`
- PrismaService: global singleton — no need to add it to any module's
  `providers`; import the service directly where needed
- Naming: Portuguese for domain concepts (inscricao, prova, questao);
  English for technical terms
- One module per domain (controller + service + module file)