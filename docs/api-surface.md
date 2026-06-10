# API Surface — OLICMAT v2.0

**Version:** 1.0
**Date:** 2026-06-09
**Status:** Post-Refactor — Matches deployed code

---

## Conventions

- **Base URL:** `/api`
- **Authentication:** Bearer Token (JWT) in `Authorization` header
- **Format:** JSON for request/response bodies; `multipart/form-data` for file uploads
- **Errors:** `{ statusCode, message, error }` — validation errors via `BadRequestException` with field-level `fieldErrors`
- **Pagination:** Not yet implemented (future enhancement)

---

## Role Abbreviations

| Abbreviation | Role |
|-------------|------|
| A | ALUNO (student competitor) |
| C | COORDENADOR_CURSO (course coordinator) |
| Av | AVALIADOR (evaluator) |
| Ad | ADMIN (administrator) |
| Pub | Public (no auth required) |

---

## 1. Authentication — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/registro` | Pub | Register new user |
| POST | `/auth/login` | Pub | Login, returns `{ token, user }` |
| POST | `/auth/esqueci-senha` | Pub | Password recovery request (placeholder) |
| POST | `/auth/redefinir-senha` | Pub | Reset password (placeholder) |
| GET | `/auth/me` | JWT | Get current authenticated user |

### POST `/auth/registro`
```json
{
  "nome": "string (min 3)",
  "email": "string (email)",
  "cpf": "string (11 digits)",
  "senha": "string (min 6)",
  "instituicao": "string (min 2)",
  "curso": "string (min 2)",
  "matricula": "string (min 3)",
  "dataNascimento": "string (ISO date)"
}
```
→ `{ token, user }`

### POST `/auth/login`
```json
{ "email": "string", "senha": "string (min 6)" }
```
→ `{ token, user }`

---

## 2. Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | JWT (A, C, Av, Ad) | Get current user profile |

---

## 3. Institutions — `/api/instituicoes`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/instituicoes` | Pub | List all institutions with courses |
| GET | `/instituicoes/:id` | Pub | Get institution with courses |

### Admin Institution Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/admin/instituicoes` | Ad | Create institution `{ nome, sigla, estado }` |
| PATCH | `/admin/instituicoes/:id` | Ad | Update institution |

---

## 4. Enrollment — `/api/inscricoes` (Competidor View)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/inscricoes` | JWT (A) | Create enrollment |
| GET | `/inscricoes/minha` | JWT (A) | Get own enrollment |
| POST | `/inscricoes/minha/iniciar-prova` | JWT (A) | Start Phase 1 exam |
| POST | `/inscricoes/minha/sortear-tema` | JWT (A) | Draw Phase 2 theme |

### POST `/inscricoes`
```json
{
  "estado": "string (2-char UF)",
  "municipio": "string (optional)",
  "instituicaoId": "string (UUID)",
  "cursoId": "string (UUID)",
  "periodo": "number (1-12, optional)"
}
```

---

## 5. Exam Execution — `/api/prova` (Competidor View)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/prova/questoes` | JWT (A) | Get questions for exam |
| POST | `/prova/responder` | JWT (A) | Submit answer to question |
| POST | `/prova/finalizar` | JWT (A) | Finish exam, auto-correct |
| GET | `/prova/resumo` | JWT (A) | Get exam summary/score |

### POST `/prova/responder`
```json
{
  "questaoId": "string (UUID)",
  "alternativa": "string (A-E, single char)"
}
```

---

## 6. Phase 2 Submission — `/api/envio` (Competidor View)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/envio/video` | JWT (A) | Upload Phase 2 video (multipart: `video`) |
| POST | `/envio/portfolio` | JWT (A) | Upload Phase 2 portfolio (multipart: `portfolio`) |
| GET | `/envio/status` | JWT (A) | Get Phase 2 submission status |

---

## 7. Ranking — `/api/ranking`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/ranking` | Pub | Get ranking by state (query: `estado`) |
| POST | `/ranking/atualizar-medalhas` | JWT (Ad) | Compute and persist medals |

---

## 8. Admin Enrollment — `/api/admin`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/inscricoes` | JWT (Ad, Av) | List all enrollments (query: `status`) |
| PATCH | `/inscricoes/:id/confirmar` | JWT (Ad, Av) | Confirm enrollment |

---

## 9. Admin Exam Management — `/api/admin/provas`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/admin/provas` | JWT (Av, Ad) | Create exam |
| GET | `/admin/provas` | JWT (Av, Ad) | List exams (query: `edicaoId`) |
| GET | `/admin/provas/:id` | JWT (Av, Ad) | Get exam with questions |
| PATCH | `/admin/provas/:id` | JWT (Av, Ad) | Update exam (draft only for Av) |
| DELETE | `/admin/provas/:id` | JWT (Ad) | Delete exam |
| POST | `/admin/provas/:id/publicar` | JWT (Ad) | Publish exam |
| POST | `/admin/provas/:id/duplicar` | JWT (Av, Ad) | Duplicate exam with questions |

### POST `/admin/provas`
```json
{
  "edicaoId": "string (UUID)",
  "fase": "number (1 or 2)",
  "titulo": "string",
  "duracaoMinutos": "number",
  "janelaInicio": "string (ISO datetime, optional)",
  "janelaFim": "string (ISO datetime, optional)"
}
```

---

## 10. Admin Question Management — `/api/admin/questoes`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/admin/provas/:provaId/questoes` | JWT (Av, Ad) | Add question to exam |
| GET | `/admin/questoes` | JWT (Av, Ad) | List all questions (query: `eixo`, `dificuldade`) |
| GET | `/admin/provas/:provaId/questoes` | JWT (Av, Ad) | Get exam questions with order |
| PATCH | `/admin/questoes/:id` | JWT (Av, Ad) | Update question (draft only for Av) |
| DELETE | `/admin/questoes/:id` | JWT (Av, Ad) | Delete question (draft only for Av) |

### POST `/admin/provas/:provaId/questoes`
```json
{
  "enunciado": "string",
  "alternativaA": "string",
  "alternativaB": "string",
  "alternativaC": "string",
  "alternativaD": "string",
  "alternativaE": "string",
  "correta": "string (A-E)",
  "eixo": "ALGEBRA | GEOMETRIA | ANALISE | ESTATISTICA | DIDATICA",
  "dificuldade": "FACIL | MEDIO | DIFICIL"
}
```

---

## 11. Admin Phase 2 Evaluation — `/api/admin/avaliacao`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/avaliacao/pendentes` | JWT (Av, Ad) | List pending Phase 2 submissions |
| POST | `/admin/avaliacao/:envioId/nota` | JWT (Av, Ad) | Assign grade to submission |

### POST `/admin/avaliacao/:envioId/nota`
```json
{
  "nota": "number (0-100)",
  "parecer": "string (optional)"
}
```

---

## 12. Admin Dashboard & Exports — `/api/admin/dashboard`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/dashboard` | JWT (Ad) | Summary metrics |
| GET | `/admin/export/inscricoes` | JWT (Ad) | Export enrollments as CSV |

### GET `/admin/dashboard` Response
```json
{
  "totalInscricoes": 150,
  "porStatus": { "PENDENTE": 20, "CONFIRMADA": 120, "REJEITADA": 10 },
  "porEstado": [{ "estado": "PI", "_count": 50 }],
  "porInstituicao": [{ "instituicao": { "nome": "UFPI" }, "_count": 30 }]
}
```

---

## 13. Admin Audit — `/api/admin/auditoria`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/auditoria` | JWT (Ad) | List audit logs (query: `entidade`, `acao`, `actorId`) |

---

## 14. Coordinator — `/api/coordenacao`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/coordenacao/alunos` | JWT (C) | List students in coordinator's courses |
| GET | `/coordenacao/inscricoes` | JWT (C) | List enrollments (query: `cursoId`, `status`) |
| GET | `/coordenacao/metricas` | JWT (C) | Aggregate metrics by course |

---

## Route Group Summary

| Prefix | Module | Purpose |
|--------|--------|---------|
| `/api/auth` | Auth | Registration, login, password recovery |
| `/api/users` | Users | Profile, admin user management |
| `/api/instituicoes` | Instituicoes | Institution and course catalog |
| `/api/inscricoes` | Olimpiada | Competidor enrollment |
| `/api/prova` | Olimpiada | Competidor exam execution |
| `/api/envio` | Olimpiada | Competidor Phase 2 submission |
| `/api/ranking` | Olimpiada | Public ranking |
| `/api/admin/provas` | Admin | Exam CRUD, publish, duplicate |
| `/api/admin/questoes` | Admin | Question CRUD |
| `/api/admin/avaliacao` | Admin | Phase 2 evaluation |
| `/api/admin/dashboard` | Admin | Metrics and exports |
| `/api/admin/auditoria` | Admin | Audit log |
| `/api/coordenacao` | Coordenacao | Coordinator views |

### Removed Routes (from v1.0)

| Prefix | Original Scope |
|--------|---------------|
| `/api/modulos` | FORPEMAT LMS |
| `/api/certificados` | FORPEMAT LMS |
| `/api/submissoes` | CONGEMAT Congress |
