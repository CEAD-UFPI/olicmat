# Role Permissions Matrix — OLICMAT v2.0

**Version:** 1.0
**Date:** 2026-06-09

---

## 1. Role Definitions

| Role | Display Name | Description |
|------|-------------|-------------|
| ALUNO | Competidor | Licenciando em Matemática participante da olimpíada |
| COORDENADOR_CURSO | Coordenador de Curso | Professor responsável por acompanhar alunos de seu(s) curso(s) |
| AVALIADOR | Avaliador | Professor responsável por elaborar provas e avaliar a Fase 2 |
| ADMIN | Administrador | Coordenador operacional com acesso total ao sistema |

---

## 2. Permission Matrix — API Endpoints

### 2.1 Authentication (`/api/auth`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| POST `/auth/registro` | ✅ | ✅ | ✅ | ✅ |
| POST `/auth/login` | ✅ | ✅ | ✅ | ✅ |
| POST `/auth/esqueci-senha` | ✅ | ✅ | ✅ | ✅ |
| POST `/auth/redefinir-senha` | ✅ | ✅ | ✅ | ✅ |
| GET `/auth/me` | ✅ | ✅ | ✅ | ✅ |

### 2.2 Users (`/api/users`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/users/me` | ✅ | ✅ | ✅ | ✅ |
| PATCH `/users/me` | ✅ | ✅ | ✅ | ✅ |
| GET `/admin/users` | — | — | — | ✅ |
| PATCH `/admin/users/:id/role` | — | — | — | ✅ |
| PATCH `/admin/users/:id` | — | — | — | ✅ |

### 2.3 Instituições (`/api/instituicoes`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/instituicoes` | ✅ | ✅ | ✅ | ✅ |
| GET `/instituicoes/:id` | ✅ | ✅ | ✅ | ✅ |
| GET `/instituicoes/:id/cursos` | ✅ | ✅ | ✅ | ✅ |
| POST `/admin/instituicoes` | — | — | — | ✅ |
| PATCH `/admin/instituicoes/:id` | — | — | — | ✅ |

### 2.4 Inscrição — Competidor View (`/api/olimpiada/inscricao`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| POST `/olimpiada/inscricao` | ✅ | — | — | — |
| GET `/olimpiada/inscricao/status` | ✅ | — | — | — |
| PATCH `/olimpiada/inscricao` | ✅ (own, if PENDENTE) | — | — | — |

### 2.5 Inscrição — Admin View (`/api/admin/inscricoes`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/admin/inscricoes` | — | — | — | ✅ |
| GET `/admin/inscricoes/:id` | — | — | — | ✅ |
| PATCH `/admin/inscricoes/:id/validar` | — | — | — | ✅ |
| PATCH `/admin/inscricoes/:id/rejeitar` | — | — | — | ✅ |

### 2.6 Provas — Admin/Avaliador Management (`/api/admin/provas`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| POST `/admin/provas` | — | — | ✅ | ✅ |
| GET `/admin/provas` | — | — | ✅ | ✅ |
| GET `/admin/provas/:id` | — | — | ✅ | ✅ |
| PATCH `/admin/provas/:id` | — | — | ✅ (drafts only) | ✅ |
| DELETE `/admin/provas/:id` | — | — | — | ✅ |
| POST `/admin/provas/:id/publicar` | — | — | — | ✅ |
| POST `/admin/provas/:id/duplicar` | — | — | ✅ | ✅ |

### 2.7 Questões — Admin/Avaliador Management (`/api/admin/questoes`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| POST `/admin/provas/:id/questoes` | — | — | ✅ | ✅ |
| GET `/admin/provas/:id/questoes` | — | — | ✅ | ✅ |
| PATCH `/admin/questoes/:id` | — | — | ✅ (draft only) | ✅ |
| DELETE `/admin/questoes/:id` | — | — | ✅ (draft only) | ✅ |

### 2.8 Execução da Prova — Competidor (`/api/olimpiada/prova`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| POST `/olimpiada/prova/iniciar` | ✅ (own, if CONFIRMADA) | — | — | — |
| POST `/olimpiada/prova/responder` | ✅ (own, during exam) | — | — | — |
| POST `/olimpiada/prova/finalizar` | ✅ (own, during exam) | — | — | — |
| GET `/olimpiada/prova/status` | ✅ (own) | — | — | — |

### 2.9 Fase 2 — Competidor (`/api/olimpiada/fase2`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/olimpiada/fase2/tema` | ✅ (own) | — | — | — |
| POST `/olimpiada/fase2/upload` | ✅ (own) | — | — | — |
| GET `/olimpiada/fase2/status` | ✅ (own) | — | — | — |

### 2.10 Avaliação Fase 2 (`/api/admin/avaliacao`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/admin/avaliacao/pendentes` | — | — | ✅ | ✅ |
| POST `/admin/avaliacao/fase2/:id/nota` | — | — | ✅ | ✅ |

### 2.11 Ranking (`/api/ranking`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/ranking/estado` | ✅ | ✅ | ✅ | ✅ |
| GET `/ranking/instituicao` | ✅ | ✅ | ✅ | ✅ |
| GET `/ranking/curso` | — | ✅ (own) | — | ✅ |
| POST `/admin/resultados/publicar` | — | — | — | ✅ |

### 2.12 Coordenação (`/api/coordenacao`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/coordenacao/alunos` | — | ✅ (own cursos) | — | — |
| GET `/coordenacao/inscricoes` | — | ✅ (own cursos) | — | ✅ |
| GET `/coordenacao/metricas` | — | ✅ (own cursos) | — | ✅ |

### 2.13 Admin Dashboard & Export (`/api/admin/dashboard`, `/api/admin/export`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/admin/dashboard` | — | — | — | ✅ |
| GET `/admin/dashboard/por-estado` | — | — | — | ✅ |
| GET `/admin/export/csv` | — | — | — | ✅ |
| GET `/admin/export/inscricoes` | — | — | — | ✅ |

### 2.14 Auditoria (`/api/admin/auditoria`)

| Endpoint | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|----------|-------|-------------------|-----------|-------|
| GET `/admin/auditoria` | — | — | — | ✅ |

---

## 3. Permission Matrix — Frontend Routes

| Route | ALUNO | COORDENADOR_CURSO | AVALIADOR | ADMIN |
|-------|-------|-------------------|-----------|-------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ | ✅ |
| `/registro` | ✅ | ✅ | ✅ | ✅ |
| `/esqueci-senha` | ✅ | ✅ | ✅ | ✅ |
| `/redefinir-senha` | ✅ | ✅ | ✅ | ✅ |
| `/ranking` | ✅ | ✅ | ✅ | ✅ |
| `/regulamento` | ✅ | ✅ | ✅ | ✅ |
| `/sobre` | ✅ | ✅ | ✅ | ✅ |
| `/competidor` | ✅ | — | — | — |
| `/competidor/inscricao` | ✅ | — | — | — |
| `/competidor/prova` | ✅ | — | — | — |
| `/competidor/envio` | ✅ | — | — | — |
| `/competidor/resultado` | ✅ | — | — | — |
| `/coordenador` | — | ✅ | — | — |
| `/coordenador/alunos` | — | ✅ | — | — |
| `/coordenador/metricas` | — | ✅ | — | — |
| `/avaliador` | — | — | ✅ | — |
| `/avaliador/provas` | — | — | ✅ | — |
| `/avaliador/provas/[id]` | — | — | ✅ | — |
| `/avaliador/provas/[id]/questoes` | — | — | ✅ | — |
| `/avaliador/fase2` | — | — | ✅ | — |
| `/admin` | — | — | — | ✅ |
| `/admin/usuarios` | — | — | — | ✅ |
| `/admin/inscricoes` | — | — | — | ✅ |
| `/admin/provas` | — | — | — | ✅ |
| `/admin/provas/[id]` | — | — | — | ✅ |
| `/admin/provas/[id]/questoes` | — | — | — | ✅ |
| `/admin/avaliacao` | — | — | — | ✅ |
| `/admin/exportar` | — | — | — | ✅ |
| `/admin/auditoria` | — | — | — | ✅ |

---

## 4. Role Transition Rules

| From | To | Allowed? | Condition |
|------|----|---------|-----------|
| ALUNO | COORDENADOR_CURSO | ✅ | ADMIN changes role |
| ALUNO | AVALIADOR | ✅ | ADMIN changes role |
| ALUNO | ADMIN | ✅ | ADMIN changes role |
| COORDENADOR_CURSO | ALUNO | ✅ | ADMIN changes role |
| COORDENADOR_CURSO | AVALIADOR | ✅ | ADMIN changes role |
| COORDENADOR_CURSO | ADMIN | ✅ | ADMIN changes role |
| AVALIADOR | ALUNO | ✅ | ADMIN changes role |
| AVALIADOR | COORDENADOR_CURSO | ✅ | ADMIN changes role |
| AVALIADOR | ADMIN | ✅ | ADMIN changes role |

---

## 5. Enforcement Model

### 5.1 Backend

- **Authentication**: `JwtAuthGuard` — validates JWT token on protected routes
- **Authorization**: `RolesGuard` + `@Roles()` decorator — checks `req.user.role` against required roles
- **Ownership**: Inscricao/Resposta services check that `userId` matches the requesting user for personal data

### 5.2 Frontend

- **Middleware-level**: `middleware.ts` checks JWT cookie/token and role for route groups
- **Layout-level**: `(dashboard)/layout.tsx` redirects by role after authentication
- **Component-level**: Role-aware sidebar/hide actions that user cannot perform
- **API-level**: 401/403 responses trigger redirect to login or error page

---

## 6. Audit Logging Triggers

The following administrative actions generate audit log entries:

| Action | Entidade | Logged Fields |
|--------|----------|---------------|
| User role change | User | actorId, target userId, oldRole, newRole |
| Enrollment validation | Inscricao | actorId, inscricaoId, oldStatus, newStatus |
| Enrollment rejection | Inscricao | actorId, inscricaoId, motivo |
| Exam creation | Prova | actorId, provaId, title |
| Exam publication | Prova | actorId, provaId |
| Exam edit (post-publication) | Prova | actorId, provaId, changed fields |
| Question creation | Questao | actorId, questaoId |
| Question edit | Questao | actorId, questaoId, changed fields |
| Question deletion | Questao | actorId, questaoId |
| Phase 2 evaluation | AvaliacaoFase2 | actorId, inscricaoId, nota, parecer |
| Results publication | RankingSnapshot | actorId, edicaoId, publish time |
| CSV export | — | actorId, export type, parameters |
