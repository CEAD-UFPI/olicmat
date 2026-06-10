# Refactor Plan — OLICMAT v2.0

**Version:** 1.0
**Date:** 2026-06-09
**Status:** Phase 2 — Ready for Implementation

---

## 1. Target Architecture

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              OLICMAT Platform v2.0               │
│                                                  │
│  ┌──────────────┐    ┌───────────────────────┐  │
│  │  Next.js 16   │    │  NestJS 11 API         │  │
│  │  App Router   │◄──►│  Modular monolith      │  │
│  │  PWA-Ready    │    │  RBAC-protected        │  │
│  └──────────────┘    └───────────────────────┘  │
│                             │                    │
│                      ┌──────┴──────┐             │
│                      │  Prisma ORM │             │
│                      └──────┬──────┘             │
│                             │                    │
│                      ┌──────┴──────┐             │
│                      │ PostgreSQL  │             │
│                      └─────────────┘             │
│                                                  │
│  Storage: Cloudinary (comprovantes, Fase 2)      │
│  Auth: JWT + Passport + bcrypt                   │
│  Container: Docker Compose                       │
└─────────────────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Domain-aligned modules**: Each backend module maps to one OLICMAT domain
2. **Role-first routing**: Frontend routes organized by role with proper guards
3. **Type safety end-to-end**: Shared types where practical, DTO validation on both sides
4. **Migration safety**: Incremental schema changes via Prisma migrations
5. **No dead code**: FORPEMAT/CONGEMAT removed entirely, not commented out

---

## 2. Target Module Map

### 2.1 Backend Modules (Post-Refactor)

```
backend/src/
├── app.module.ts              # Root module
├── main.ts                    # Bootstrap
├── prisma.service.ts          # Global Prisma singleton
│
├── auth/                      # Authentication
│   ├── auth.module.ts
│   ├── auth.controller.ts     # registro, login, esqueci-senha, redefinir-senha
│   ├── auth.service.ts
│   ├── dto/                   # Zod schemas
│   └── strategies/            # JWT strategy
│
├── users/                     # User profile + admin user management
│   ├── users.module.ts
│   ├── users.controller.ts    # me, GET /admin/users, PATCH /admin/users/:id/role
│   └── users.service.ts
│
├── olimpiada/                 # OLICMAT core domain
│   ├── olimpiada.module.ts
│   ├── inscricao/             # Enrollment management
│   │   ├── inscricao.controller.ts
│   │   ├── inscricao.service.ts
│   │   └── dto/
│   ├── prova/                 # Exam execution (competidor view)
│   │   ├── prova.controller.ts
│   │   ├── prova.service.ts
│   │   └── dto/
│   ├── envio/                 # Phase 2 submission
│   │   ├── envio.controller.ts
│   │   ├── envio.service.ts
│   │   └── dto/
│   └── ranking/               # Results and ranking
│       ├── ranking.controller.ts
│       └── ranking.service.ts
│
├── admin/                     # Administrative operations
│   ├── admin.module.ts
│   ├── provas/                # Exam CRUD + question management
│   │   ├── provas.controller.ts
│   │   ├── provas.service.ts
│   │   └── dto/
│   ├── questoes/              # Question CRUD
│   │   ├── questoes.controller.ts
│   │   ├── questoes.service.ts
│   │   └── dto/
│   ├── avaliacao/             # Phase 2 evaluation
│   │   ├── avaliacao.controller.ts
│   │   ├── avaliacao.service.ts
│   │   └── dto/
│   ├── dashboard/             # Admin dashboards + export
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
│   │   └── dto/
│   └── auditoria/             # Audit log
│       ├── auditoria.controller.ts
│       ├── auditoria.service.ts
│       └── dto/
│
├── coordenacao/               # Coordinator experience
│   ├── coordenacao.module.ts
│   ├── coordenacao.controller.ts
│   └── coordenacao.service.ts
│
├── instituicoes/              # Institution + course catalog
│   ├── instituicoes.module.ts
│   ├── instituicoes.controller.ts
│   └── instituicoes.service.ts
│
├── upload/                    # Cloudinary integration (shared)
│   ├── upload.module.ts
│   └── upload.service.ts
│
└── common/                    # Shared infrastructure
    ├── decorators/
    │   └── roles.decorator.ts
    ├── guards/
    │   ├── jwt-auth.guard.ts
    │   └── roles.guard.ts
    └── filters/               # Global exception filter (NEW)
```

### 2.2 Modules to Remove (Entirely)

```
backend/src/lms/               # Entire directory — FORPEMAT
backend/src/congresso/         # Entire directory — CONGEMAT
backend/src/app.controller.ts  # Dead scaffolding
backend/src/app.service.ts     # Dead scaffolding
```

### 2.3 Modules to Create (New)

```
backend/src/admin/             # Administrative module
backend/src/coordenacao/       # Coordinator module
backend/src/instituicoes/      # Institution/course module
```

---

## 3. Target Database / Domain Model

### 3.1 Complete Prisma Schema (Target)

```prisma
// ============================================
// ENUMS
// ============================================

enum Role {
  ALUNO               // Student competitor
  COORDENADOR_CURSO    // Course coordinator (NEW)
  AVALIADOR           // Exam evaluator
  ADMIN               // System administrator
}

enum StatusInsc {
  PENDENTE
  CONFIRMADA
  REJEITADA
}

enum StatusProva {
  RASCUNHO
  PUBLICADA
  EM_ANDAMENTO
  ENCERRADA
}

enum Medalha {
  OURO
  PRATA
  BRONZE
}

enum Eixo {
  ALGEBRA
  GEOMETRIA
  ANALISE
  ESTATISTICA
  DIDATICA
}

enum Dificuldade {
  FACIL
  MEDIO
  DIFICIL
}

enum StatusEnvioFase2 {
  PENDENTE
  ENVIADO
  AVALIADO
}

// ============================================
// CATALOG MODELS (NEW)
// ============================================

model Instituicao {
  id        String   @id @default(uuid())
  nome      String
  sigla     String   @unique
  estado    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cursos    Curso[]
}

model Curso {
  id             String            @id @default(uuid())
  nome           String
  instituicaoId  String
  instituicao    Instituicao       @relation(fields: [instituicaoId], references: [id], onDelete: Cascade)
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  coordenadores   CoordenadorCurso[]
  inscricoes      Inscricao[]

  @@unique([nome, instituicaoId])
}

// ============================================
// AUTH / USER MODEL
// ============================================

model User {
  id              String    @id @default(uuid())
  nome            String
  email           String    @unique
  cpf             String    @unique
  senhaHash       String    // renamed from senha
  role            Role      @default(ALUNO)
  instituicaoId   String?
  cursoId         String?
  matricula       String
  comprovanteUrl  String?
  dataNascimento  DateTime
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  inscricao       Inscricao?
  coordenadorias  CoordenadorCurso[]
  avaliacoes      AvaliacaoFase2[]
  auditLogs       AuditLog[]
}

model CoordenadorCurso {
  id        String   @id @default(uuid())
  userId    String   @unique
  cursoId   String

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  curso     Curso    @relation(fields: [cursoId], references: [id], onDelete: Cascade)
}

// ============================================
// EDITION MODEL (NEW)
// ============================================

model Edicao {
  id              String    @id @default(uuid())
  ano             Int       @unique
  titulo          String
  status          String    @default("PLANEJAMENTO") // PLANEJAMENTO, INSCRICOES_ABERTAS, EM_ANDAMENTO, ENCERRADA
  dataInicio      DateTime?
  dataFim         DateTime?
  pesoFase1       Float     @default(0.5)
  pesoFase2       Float     @default(0.5)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  provas          Prova[]
  inscricoes      Inscricao[]
}

// ============================================
// ENROLLMENT MODEL (MODIFIED)
// ============================================

model Inscricao {
  id              String      @id @default(uuid())
  userId          String      @unique
  edicaoId        String      // NEW FK
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  edicao          Edicao      @relation(fields: [edicaoId], references: [id])
  status          StatusInsc  @default(PENDENTE)
  estado          String
  municipio       String?
  instituicaoId   String      // Changed from flat String
  cursoId         String      // Changed from flat String
  periodo         Int?
  comprovanteUrl  String?
  fase1Nota       Float?
  fase1Inicio     DateTime?
  fase1Fim        DateTime?
  fase2Tema       String?
  notaFinal       Float?
  medalha         Medalha?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  instituicao     Instituicao @relation(fields: [instituicaoId], references: [id])
  curso           Curso       @relation(fields: [cursoId], references: [id])
  respostas       Resposta[]
  enviosFase2     EnvioFase2[]
  avaliacoes      AvaliacaoFase2[]

  @@unique([userId, edicaoId])  // One enrollment per edition
}

// ============================================
// EXAM MODELS (NEW + MODIFIED)
// ============================================

model Prova {
  id              String       @id @default(uuid())
  edicaoId        String
  fase            Int          // 1 or 2
  titulo          String
  duracaoMinutos  Int
  status          StatusProva  @default(RASCUNHO)
  publicadaEm     DateTime?
  janelaInicio    DateTime?
  janelaFim       DateTime?
  versao          Int          @default(1)
  createdBy       String
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  edicao          Edicao       @relation(fields: [edicaoId], references: [id])
  questoes        ProvaQuestao[]
  respostas       Resposta[]
}

model Questao {
  id              String          @id @default(uuid())
  enunciado       String
  alternativaA    String
  alternativaB    String
  alternativaC    String
  alternativaD    String
  alternativaE    String
  correta         String
  eixo            Eixo
  dificuldade     Dificuldade
  createdBy       String?         // NEW
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt  // NEW

  provas          ProvaQuestao[]
  respostas       Resposta[]
}

model ProvaQuestao {
  id        String   @id @default(uuid())
  provaId   String
  questaoId String
  ordem     Int

  prova     Prova    @relation(fields: [provaId], references: [id], onDelete: Cascade)
  questao   Questao  @relation(fields: [questaoId], references: [id], onDelete: Cascade)

  @@unique([provaId, questaoId])
  @@unique([provaId, ordem])
}

model Resposta {
  id                  String   @id @default(uuid())
  inscricaoId         String
  provaId             String   // NEW
  questaoId           String
  alternativaMarcada  String   // renamed from alternativa
  correta             Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt  // NEW

  inscricao           Inscricao @relation(fields: [inscricaoId], references: [id], onDelete: Cascade)
  prova               Prova     @relation(fields: [provaId], references: [id])
  questao             Questao   @relation(fields: [questaoId], references: [id], onDelete: Cascade)

  @@unique([inscricaoId, provaId, questaoId])
}

// ============================================
// PHASE 2 MODELS (NEW)
// ============================================

model EnvioFase2 {
  id          String          @id @default(uuid())
  inscricaoId String
  tipo        String          // e.g., "VIDEO", "PORTFOLIO", "RESENHA"
  arquivoUrl  String
  status      StatusEnvioFase2 @default(PENDENTE)
  enviadoEm   DateTime        @default(now())

  inscricao   Inscricao       @relation(fields: [inscricaoId], references: [id], onDelete: Cascade)
}

model AvaliacaoFase2 {
  id          String    @id @default(uuid())
  inscricaoId String
  avaliadorId String
  nota        Float
  parecer     String?
  avaliadoEm  DateTime  @default(now())

  inscricao   Inscricao @relation(fields: [inscricaoId], references: [id], onDelete: Cascade)
  avaliador   User      @relation(fields: [avaliadorId], references: [id])

  @@unique([inscricaoId, avaliadorId])
}

// ============================================
// RANKING & AUDIT (NEW)
// ============================================

model RankingSnapshot {
  id          String    @id @default(uuid())
  edicaoId    String
  estado      String?
  dados       Json      // Serialized ranking data
  publicadoEm DateTime?
  createdAt   DateTime  @default(now())
}

model AuditLog {
  id          String   @id @default(uuid())
  actorId     String
  acao        String   // e.g., "INSCRICAO.CONFIRMAR", "PROVA.PUBLICAR"
  entidade    String   // e.g., "Inscricao", "Prova", "Questao"
  entidadeId  String
  payload     Json?
  createdAt   DateTime @default(now())

  actor       User     @relation(fields: [actorId], references: [id])
}
```

### 3.2 Models Removed

```
Modulo            # FORPEMAT
ProgressoCurso    # FORPEMAT
Certificado       # FORPEMAT
Submissao         # CONGEMAT
```

### 3.3 Enums Removed

```
TipoSubm          # CONGEMAT (ARTIGO, POSTER)
StatusSubm        # CONGEMAT (EM_AVALIACAO, APROVADO, REJEITADO)
```

---

## 4. Target API Surface

### 4.1 Route Groups

| Prefix | Module | Purpose |
|--------|--------|---------|
| `/api/auth` | Auth | Registration, login, password reset |
| `/api/users` | Users | Profile, admin user management |
| `/api/instituicoes` | Instituicoes | Institution and course catalog |
| `/api/olimpiada/inscricao` | Olimpiada | Enrollment CRUD (competidor view) |
| `/api/olimpiada/prova` | Olimpiada | Exam execution (competidor view) |
| `/api/olimpiada/fase2` | Olimpiada | Phase 2 submission |
| `/api/ranking` | Olimpiada | Public ranking and results |
| `/api/admin/provas` | Admin | Exam CRUD |
| `/api/admin/questoes` | Admin | Question CRUD |
| `/api/admin/inscricoes` | Admin | Enrollment validation |
| `/api/admin/avaliacao` | Admin | Phase 2 evaluation |
| `/api/admin/dashboard` | Admin | Dashboards and metrics |
| `/api/admin/export` | Admin | CSV exports |
| `/api/admin/auditoria` | Admin | Audit log |
| `/api/coordenacao` | Coordenacao | Coordinator views |

### 4.2 Removed Route Prefixes

```
/api/modulos        # FORPEMAT
/api/certificados   # FORPEMAT
/api/submissoes     # CONGEMAT
```

### 4.3 Permissions Matrix

See `docs/role-permissions-matrix.md` for the complete matrix.

---

## 5. Target Role & Permission Model

### 5.1 Role Hierarchy

```
ADMIN                  — Full system access
├── AVALIADOR          — Exam question management, Phase 2 evaluation
├── COORDENADOR_CURSO  — View students/courses, monitor enrollment status
└── ALUNO              — Self-service: register, enroll, take exam, view results
```

### 5.2 Permission Summary

| Capability | ALUNO | COORD | AVALIADOR | ADMIN |
|---|---|---|---|---|
| Register / Login | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |
| Create enrollment | ✅ | — | — | — |
| Take Phase 1 exam | ✅ (own) | — | — | — |
| Upload Phase 2 | ✅ (own) | — | — | — |
| View own results | ✅ | — | — | — |
| View students by course | — | ✅ | — | ✅ |
| Monitor enrollment status | — | ✅ | — | ✅ |
| Coordinator metrics | — | ✅ | — | ✅ |
| Create/edit questions | — | — | ✅ | ✅ |
| Create/manage exams | — | — | ✅ | ✅ |
| Publish exams | — | — | — | ✅ |
| Evaluate Phase 2 | — | — | ✅ | ✅ |
| Validate enrollments | — | — | — | ✅ |
| Manage users | — | — | — | ✅ |
| Export data | — | — | — | ✅ |
| View audit logs | — | — | — | ✅ |
| Publish results | — | — | — | ✅ |

---

## 6. Target Frontend Route Map

### 6.1 Route Structure (Post-Refactor)

```
app/
├── layout.tsx                    # Root layout (Header + Footer)
├── page.tsx                      # Landing page (/)
│
├── (auth)/                       # Auth route group (no layout wrapper)
│   ├── login/page.tsx            # /login
│   ├── registro/page.tsx         # /registro
│   ├── esqueci-senha/page.tsx    # /esqueci-senha (NEW)
│   └── redefinir-senha/page.tsx  # /redefinir-senha (NEW)
│
├── ranking/page.tsx              # /ranking (public results)
│
├── (dashboard)/                  # Protected route group
│   ├── layout.tsx                # Auth guard + Sidebar
│   │
│   ├── competidor/               # ALUNO routes
│   │   ├── page.tsx              # /competidor — dashboard
│   │   ├── inscricao/page.tsx    # /competidor/inscricao
│   │   ├── prova/page.tsx        # /competidor/prova
│   │   ├── envio/page.tsx        # /competidor/envio
│   │   └── resultado/page.tsx    # /competidor/resultado (NEW)
│   │
│   ├── coordenador/              # COORDENADOR_CURSO routes (NEW)
│   │   ├── page.tsx              # /coordenador — dashboard
│   │   ├── alunos/page.tsx       # /coordenador/alunos
│   │   └── metricas/page.tsx     # /coordenador/metricas
│   │
│   ├── avaliador/                # AVALIADOR routes (NEW)
│   │   ├── page.tsx              # /avaliador — dashboard
│   │   ├── provas/page.tsx       # /avaliador/provas
│   │   ├── provas/[id]/page.tsx  # /avaliador/provas/[id]
│   │   ├── provas/[id]/questoes/page.tsx   # Question list
│   │   └── fase2/page.tsx        # Phase 2 evaluation
│   │
│   └── admin/                    # ADMIN routes (NEW)
│       ├── page.tsx              # /admin — dashboard
│       ├── usuarios/page.tsx     # /admin/usuarios
│       ├── inscricoes/page.tsx   # /admin/inscricoes
│       ├── provas/page.tsx       # /admin/provas
│       ├── provas/[id]/page.tsx  # /admin/provas/[id]
│       ├── provas/[id]/questoes/page.tsx
│       ├── avaliacao/page.tsx    # Phase 2 evaluation
│       ├── exportar/page.tsx     # CSV exports
│       └── auditoria/page.tsx    # Audit log
│
└── (public)/                     # Public content (NEW)
    ├── regulamento/page.tsx      # /regulamento
    └── sobre/page.tsx            # /sobre
```

### 6.2 Routes Removed

```
/cursos                # FORPEMAT module catalog
/cursos/[moduloId]     # FORPEMAT module detail
/congresso             # CONGEMAT submission page
```

### 6.3 Navigation Updates

**Header:**
- Public: Sobre, Cronograma, Realização, Entrar, Cadastre-se
- Authenticated: Redirect to role-specific dashboard

**Sidebar (role-aware):**
- ALUNO: Visão Geral, Inscrição, Prova Fase 1, Envio Fase 2, Resultado
- COORDENADOR_CURSO: Visão Geral, Alunos, Métricas
- AVALIADOR: Visão Geral, Provas, Questões, Avaliação Fase 2
- ADMIN: Visão Geral, Usuários, Inscrições, Provas, Avaliação, Exportar, Auditoria

**Footer:**
- Single column: OLICMAT (Sobre, Regulamento, Contato, Política de Privacidade)
- Remove FORPEMAT and CONGEMAT columns entirely

---

## 7. Implementation Sequence

### 7.1 Phase 3a — Prisma Schema & Database (First)

**Ordered steps:**
1. **Backup current schema** — copy `schema.prisma` to `schema.prisma.backup`
2. **Remove FORPEMAT/CONGEMAT models and enums** from schema.prisma
3. **Add COORDENADOR_CURSO to Role enum**
4. **Add new models**: Instituicao, Curso, CoordenadorCurso, Edicao, Prova, ProvaQuestao, EnvioFase2, AvaliacaoFase2, RankingSnapshot, AuditLog
5. **Add new enums**: StatusProva, StatusEnvioFase2
6. **Modify User**: rename `senha`→`senhaHash`, add `instituicaoId`/`cursoId` (nullable initially), add relations
7. **Modify Inscricao**: add `edicaoId`, add `instituicaoId`/`cursoId` FKs, add relations
8. **Modify Resposta**: rename `alternativa`→`alternativaMarcada`, add `provaId`, add `updatedAt`
9. **Update unique constraints**
10. **Create migration**: `npx prisma migrate dev --name refactor_olicmat_v2`
11. **Rewrite seed.ts**: Admin user, sample institutions, courses, questions, editions
12. **Test migration**: `npx prisma migrate reset` → verify all tables

### 7.2 Phase 3b — Backend Refactor (Second)

**Ordered steps:**

**Step 1: Remove old modules**
1. Delete `backend/src/lms/` directory
2. Delete `backend/src/congresso/` directory
3. Delete `backend/src/app.controller.ts` and `backend/src/app.service.ts`
4. Remove LmsModule and CongressoModule from `app.module.ts`
5. Verify backend compiles: `npm run build`

**Step 2: Update existing modules**
1. Update `auth/auth.service.ts`: rename `senha` references to `senhaHash`, handle COORDENADOR_CURSO in registration
2. Update `users/users.controller.ts`: add admin user management endpoints
3. Update `olimpiada/inscricao/`: add `edicaoId`, `instituicaoId`/`cursoId` FK handling
4. Update `olimpiada/prova/`: add `provaId` to answer submission, connect to Prova entity
5. Update `olimpiada/envio/`: refactor to use EnvioFase2 model instead of Inscricao.fase2VideoUrl/fase2PortfolioUrl
6. Update `olimpiada/ranking/`: connect to Edicao, add publish control
7. Update DTOs to reflect schema changes

**Step 3: Create new modules**
1. Create `backend/src/instituicoes/` module (CRUD for Instituicao/Curso)
2. Create `backend/src/admin/` module:
   - `admin/provas/` — exam CRUD, publish, duplicate
   - `admin/questoes/` — question CRUD
   - `admin/avaliacao/` — Phase 2 evaluation
   - `admin/dashboard/` — metrics and CSV export
   - `admin/auditoria/` — audit log view
3. Create `backend/src/coordenacao/` module (student list, metrics)

**Step 4: Infrastructure improvements**
1. Add global exception filter in `common/filters/`
2. Add request logging interceptor in `common/interceptors/`
3. Make PrismaService a `@Global()` module
4. Add password recovery endpoints to auth controller
5. Update Cloudinary paths to use `olicmat/` prefix consistently

### 7.3 Phase 3c — Frontend Refactor (Third)

**Ordered steps:**

**Step 1: Remove old pages**
1. Delete `app/cursos/` directory
2. Delete `app/congresso/` directory
3. Delete `Modulo` type from `types/index.ts`
4. Verify frontend compiles: `npm run build`

**Step 2: Update shared components**
1. Update `landing/Hero.tsx` — OLICMAT-only tagline
2. Update `landing/Sobre.tsx` — single OLICMAT focus, remove 3-pillar cards
3. Update `landing/Cronograma.tsx` — remove FORPEMAT/CONGEMAT events
4. Update `layout/Footer.tsx` — single OLICMAT column
5. Update types in `types/index.ts` — add new enums, update Inscricao, add Edicao, Prova, etc.

**Step 3: Role-based routing**
1. Create `middleware.ts` for server-side route protection by role
2. Update `(dashboard)/layout.tsx` to redirect by role after auth
3. Create role-aware `Sidebar.tsx` with different links per role

**Step 4: Create new pages**
1. `app/(dashboard)/competidor/resultado/page.tsx`
2. `app/(dashboard)/coordenador/` — dashboard, alunos, metricas
3. `app/(dashboard)/avaliador/` — dashboard, provas, questoes, fase2
4. `app/(dashboard)/admin/` — dashboard, usuarios, inscricoes, provas, avaliacao, exportar, auditoria
5. `app/(auth)/esqueci-senha/page.tsx`
6. `app/(auth)/redefinir-senha/page.tsx`
7. `app/(public)/regulamento/page.tsx`
8. `app/(public)/sobre/page.tsx`

**Step 5: PWA configuration**
1. Create `public/manifest.json`
2. Add PWA meta tags to root layout
3. Configure service worker if needed (Next.js 16 PWA support)

### 7.4 Phase 3d — Testing (Fourth)

1. Write backend unit tests for:
   - Auth service (register, login, password hashing)
   - RBAC guards (role-based access)
   - Enrollment service (create, validate, reject)
   - Exam service (question CRUD, answer recording, auto-correction)
   - Phase 2 evaluation service
   - Ranking computation
2. Write backend integration tests for:
   - Complete enrollment flow
   - Complete exam execution flow
   - Phase 2 submission + evaluation flow
3. Write frontend tests for:
   - Auth forms (validation)
   - Exam timer behavior
   - Role-based route protection
4. Document any tests that cannot be completed

---

## 8. Migration Strategy

### 8.1 Schema Migration

Since only one initial migration exists with no production data, use a **destructive-then-rebuild** strategy:

1. Create a new migration from the updated schema
2. All developers run `prisma migrate reset` to rebuild from scratch
3. No backward compatibility needed — this is pre-production

### 8.2 Frontend Migration

1. Remove FORPEMAT/CONGEMAT pages first (safe — they have no auth dependencies)
2. Update shared components next (landing, footer)
3. Add new routes last (they depend on updated backend APIs)

### 8.3 Backend Migration

1. Remove old modules first (safe — they're independent)
2. Modify existing modules incrementally (keep tests passing)
3. Add new modules (depend on schema changes being complete)

---

## 9. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build breaks during refactor | Medium | High | Incremental steps, verify compilation after each change |
| Prisma migration conflicts | Low | High | Only one migration exists; reset strategy is clean |
| Next.js 16 breaking changes | Medium | Medium | Read AGENTS.md guidance; consult node_modules/next/dist/docs/ |
| Lost functionality during removal | Low | Medium | Git history preserves all code; archive branch before deletions |
| Frontend/backend API mismatch | Medium | Medium | Update types on both sides simultaneously; strict DTO validation |
| PWA implementation complexity | Medium | Low | Can be deferred to separate PR if needed |

---

## 10. Rollback Strategy

All changes will be made on a feature branch. To roll back:

1. **Full rollback**: Switch back to `main` branch
2. **Selective rollback**: Each commit is atomic — revert individual commits
3. **Schema rollback**: Run `prisma migrate reset` with the backup schema
4. **Frontend rollback**: Revert by commit; deleted pages can be restored from git history

---

## 11. Documentation Deliverables

During Phase 3, the following documents will be created/updated:

| Document | Phase | Status |
|----------|-------|--------|
| `docs/refactor-audit.md` | Phase 1 | ✅ Complete |
| `docs/refactor-plan.md` | Phase 2 | ✅ Current |
| `docs/refactor-summary.md` | Phase 3 | 📝 After implementation |
| `docs/role-permissions-matrix.md` | Phase 3 | 📝 During backend refactor |
| `docs/api-surface.md` | Phase 3 | 📝 After API refactor |
| `docs/database-migration-blueprint.md` | Phase 3 | 📝 During schema changes |
| `docs/frontend-route-map.md` | Phase 3 | 📝 During frontend refactor |
| `docs/refactor-checklist.md` | Phase 3 | 📝 After completion |
| `CLAUDE.md` (root) | Phase 3 | 📝 After completion |
