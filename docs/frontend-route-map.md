# Frontend Route Map — OLICMAT v2.0

**Version:** 1.1
**Date:** 2026-07-07
**Status:** Post-Refactor — Matches deployed code
**Since v1.0:** Course and Edition admin pages now ship Eye (view) actions. All "view" modals on the admin/comissão dashboards are built with the unified `<DetailPanel>` component (`frontend/src/components/ui/detail-panel.tsx`).

---

## Route Structure

```
app/
├── layout.tsx                          # Root layout (Header + Footer + ThemeProvider)
├── page.tsx                            # Landing page (/)
│
├── (auth)/                             # Auth route group
│   ├── login/page.tsx                  # /login
│   ├── registro/page.tsx               # /registro (2-step form)
│   ├── esqueci-senha/page.tsx          # /esqueci-senha
│   └── redefinir-senha/page.tsx        # /redefinir-senha
│
├── (public)/                           # Public content
│   ├── layout.tsx                      # Simple layout (no sidebar)
│   ├── regulamento/page.tsx            # /regulamento
│   └── sobre/page.tsx                  # /sobre
│
├── ranking/page.tsx                    # /ranking (public results)
│
├── (dashboard)/                        # Protected route group
│   ├── layout.tsx                      # Auth guard + Sidebar
│   │
│   ├── competidor/                     # ALUNO routes
│   │   ├── page.tsx                    # /competidor — Dashboard
│   │   ├── inscricao/page.tsx          # /competidor/inscricao
│   │   ├── prova/page.tsx              # /competidor/prova
│   │   ├── envio/page.tsx              # /competidor/envio
│   │   └── resultado/page.tsx          # /competidor/resultado
│   │
│   ├── coordenador/                    # COORDENADOR_CURSO routes
│   │   ├── page.tsx                    # /coordenador — Dashboard
│   │   ├── alunos/page.tsx             # /coordenador/alunos
│   │   └── metricas/page.tsx           # /coordenador/metricas
│   │
│   ├── avaliador/                      # AVALIADOR routes
│   │   ├── page.tsx                    # /avaliador — Dashboard
│   │   ├── provas/page.tsx             # /avaliador/provas
│   │   ├── provas/[id]/page.tsx        # /avaliador/provas/[id]
│   │   └── fase2/page.tsx              # /avaliador/fase2
│   │
│   └── admin/                          # ADMIN routes
│       ├── page.tsx                    # /admin — Dashboard
│       ├── usuarios/page.tsx           # /admin/usuarios
│       ├── inscricoes/page.tsx         # /admin/inscricoes
│       ├── provas/page.tsx             # /admin/provas
│       ├── avaliacao/page.tsx          # /admin/avaliacao
│       ├── exportar/page.tsx           # /admin/exportar
│       └── auditoria/page.tsx          # /admin/auditoria
│
└── middleware.ts                        # Client-side auth proxy
```

---

## Route Inventory (28 routes)

### Public Routes (No Auth)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, Sobre, Cronograma, Parceiros |
| `/login` | Auth | Login form |
| `/registro` | Auth | Two-step registration form |
| `/esqueci-senha` | Auth | Password recovery request |
| `/redefinir-senha` | Auth | Password reset form |
| `/ranking` | Public | Competition results by state |
| `/regulamento` | Public | Competition rules |
| `/sobre` | Public | About OLICMAT |

### ALUNO Routes (`/competidor`)

| Route | Description | API Calls |
|-------|-------------|-----------|
| `/competidor` | Dashboard overview | GET `/users/me` |
| `/competidor/inscricao` | Create/edit enrollment | POST `/inscricoes`, GET `/inscricoes/minha` |
| `/competidor/prova` | Phase 1 exam execution | GET `/prova/questoes`, POST `/prova/responder`, POST `/prova/finalizar` |
| `/competidor/envio` | Phase 2 file upload | POST `/envio/*`, GET `/envio/status` |
| `/competidor/resultado` | View results/marks | GET `/inscricoes/minha`, GET `/ranking` |

### COORDENADOR_CURSO Routes (`/coordenador`)

| Route | Description | API Calls |
|-------|-------------|-----------|
| `/coordenador` | Dashboard overview | GET `/coordenacao/metricas` |
| `/coordenador/alunos` | Student list & filters | GET `/coordenacao/alunos`, GET `/coordenacao/inscricoes` |
| `/coordenador/metricas` | Aggregate metrics | GET `/coordenacao/metricas` |

### AVALIADOR Routes (`/avaliador`)

| Route | Description | API Calls |
|-------|-------------|-----------|
| `/avaliador` | Dashboard overview | Quick links |
| `/avaliador/provas` | Exam list | GET `/admin/provas` |
| `/avaliador/provas/[id]` | Exam detail, questions | GET `/admin/provas/:id`, GET `/admin/provas/:id/questoes` |
| `/avaliador/fase2` | Phase 2 evaluation | GET `/admin/avaliacao/pendentes`, POST `/admin/avaliacao/:id/nota` |

### ADMIN Routes (`/admin`)

| Route | Description | API Calls |
|-------|-------------|-----------|
| `/admin` | Dashboard overview | GET `/admin/dashboard` |
| `/admin/usuarios` | User management | GET `/users`, PATCH `/admin/users/:id/role` — opens `<DetailPanel>` on Eye action |
| `/admin/instituicoes` | Institution + course management | GET `/instituicoes`, POST `/admin/instituicoes` — opens `<DetailPanel>` on Eye action |
| `/admin/cursos` | Course management | GET `/admin/cursos`, POST `/admin/cursos` — opens `<DetailPanel>` on Eye action (was missing in v1.0); supports `notaEnade` field |
| `/admin/edicoes` | Edition management | GET `/admin/edicoes`, POST `/admin/edicoes` — opens `<DetailPanel>` on Eye action (was missing in v1.0) |
| `/admin/inscricoes` | Enrollment validation | GET `/inscricoes`, PATCH `/inscricoes/:id/confirmar` — opens `<DetailPanel>` on Eye action with expanded fields (fase1Nota/fase2Tema/notaFinal/medalha/edition context) |
| `/admin/provas` | Exam management | GET/POST `/admin/provas` |
| `/admin/avaliacao` | Phase 2 evaluation | GET `/admin/avaliacao/pendentes`, POST `/admin/avaliacao/:id/nota` (calls `/api/correcao/*`) |
| `/admin/exportar` | CSV exports | GET `/admin/export/inscricoes` |
| `/admin/auditoria` | Audit log viewer | GET `/admin/auditoria` |

### COMISSAO Routes (`/comissao`) — read-only oversight

| Route | Description | API Calls |
|-------|-------------|-----------|
| `/comissao` | Dashboard overview | Quick links |
| `/comissao/inscricoes` | Inscription read-only view | GET `/inscricoes` — opens `<DetailPanel>` on Eye action (no Edit button surfaced) |
| `/comissao/provas` | Exam read-only view | GET `/admin/provas` |
| `/comissao/avaliacao` | Phase 2 read-only audit | GET `/api/correcao/pendentes`, GET `/api/correcao/historico` |
| `/comissao/auditoria` | Audit log viewer | GET `/admin/auditoria` |
| `/comissao/exportar` | CSV exports | GET `/admin/export/inscricoes` |

---

## Navigation Components

### Header (`components/layout/Header.tsx`)
- Public: Sobre, Cronograma, Realização, Entrar, Cadastre-se
- Authenticated: Dashboard (role-redirected), Sair

### Sidebar (`components/layout/Sidebar.tsx`)
- Role-aware — shows different links per role
- Footer: "Voltar ao site", "Sair da conta"

### Footer (`components/layout/Footer.tsx`)
- Single OLICMAT column: Sobre, Regulamento, Contato
- Bottom bar: Política de Privacidade, Termos de Uso

---

## Route Protection

1. **Middleware** — checks for auth token on protected routes, redirects to `/login`
2. **Dashboard Layout** — client-side auth verification via `loadUser()`, redirects to `/login` if unauthenticated
3. **Sidebar** — role-aware link rendering, but ALL authenticated users can access any `/dashboard/*` route (role enforcement is server-side via API guards)

---

## PWA Configuration

- **Manifest:** `public/manifest.json` — OLICMAT branding
- **Meta tags:** theme-color, apple-mobile-web-app-capable, apple-mobile-web-app-title
- **Status:** Basic PWA foundation in place; service worker caching not yet implemented

---

## Deleted Routes (v1.0 → v2.0)

| Route | Original Scope | Reason |
|-------|---------------|--------|
| `/cursos` | FORPEMAT | Out of scope per BRD_OLICMAT §3.2 |
| `/cursos/[moduloId]` | FORPEMAT | Out of scope |
| `/congresso` | CONGEMAT | Out of scope |
