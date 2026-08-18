# ARCHITECTURE.md — OLICMAT v2.1

Este documento descreve as decisões de arquitetura da reorganização em 3 módulos
e o fluxo de autenticação unificada.

---

## 1. Visão Geral

OLICMAT é um monorepo (npm workspaces) com 5 aplicações + 1 pacote compartilhado:

| App | Pasta | Stack | Porta |
|-----|-------|-------|-------|
| `@olicmat/web` | `apps/web` | Next.js 16 | 3005 (dev) |
| `@olicmat/admin-web` | `apps/admin/web` | Next.js 16 | 3006 (dev) |
| `@olicmat/admin-api` | `apps/admin/api` | NestJS 11 + Prisma | 3333 |
| `@olicmat/exam-web` | `apps/exam/web` | Next.js 15 | 3007 (dev) |
| `@olicmat/exam-api` | `apps/exam/api` | NestJS 11 + Prisma | 3334 |
| `@olicmat/shared` | `packages/shared` | TypeScript (lib) | — |

### Módulos

- **WEB** (`apps/web`) — landing pública: institucional, cronograma, regulamento, ranking.
- **Cadastro/Configurações** (`apps/admin/*`) — área administrativa completa.
- **Provas** (`apps/exam/*`) — execução de prova isolada, somente ALUNO e admin.

---

## 2. Banco de Dados Compartilhado

Um único PostgreSQL é usado por **todos** os módulos (`schema.prisma` é a fonte de
verdade). Cada backend declara seu próprio cliente Prisma:

- **`apps/admin/api`** — generator `prisma-client` (emite `.ts`, compilado pelo `tsc`).
- **`apps/exam/api`** — generator `prisma-client-js` (emite `.js`, copiado explicitamente
  para `dist/generated` no build do Docker).

Ambos apontam para o mesmo `DATABASE_URL`. Migrations são aplicadas **somente** pelo
`admin-api` (via `start.sh` → `prisma migrate deploy`), evitando corrida entre serviços.

---

## 3. Autenticação Unificada (Transition Token)

Um único `JWT_SECRET` compartilhado. O backend principal emite o token de login; o
Módulo Provas **não** emite login, apenas valida e troca tokens.

```
┌─────────────┐  login (email+senha)   ┌─────────────────────────────┐
│  admin-web  │ ─────────────────────► │  admin-api                  │
│             │                        │  POST /api/auth/login        │
│             │  JWT (sessão login)    │  → assina LOGIN token        │
│             │ ◄───────────────────── │  POST /api/auth/transition-  │
│             │                        │       token (JwtAuthGuard)   │
│             │                        │  → assina EXAM_TRANSITION    │
│             │                        │    (TTL 120s, type check)    │
└─────────────┘                        └───────────────┬─────────────┘
       │                                               │ redirect 302
       │  /auth/claim?token=<EXAM_TRANSITION>           ▼
       ▼                                        ┌─────────────────────────────┐
┌─────────────┐  POST /api/auth/claim           │  exam-web  (/auth/claim)    │
│  exam-api   │ ◄───────────────────────────────│  repassa o token para a API │
│             │  verifica assinatura + type     └─────────────────────────────┘
│             │  assina EXAM_SESSION (4h)
└─────────────┘
```

- **`EXAM_TRANSITION`** — token curto (120s), de uso único na prática, usado só para a
  ponte entre módulos. Carrega `type` e `sub` (id do usuário).
- **`EXAM_SESSION`** — token de sessão de prova (4h), usado pelo `exam-api` para
  autorizar `prova/iniciar`, `prova/questoes`, `prova/responder`, `prova/finalizar`.
- A validação de `type` impede que um token de login do admin-api seja aceito
  diretamente como sessão de prova (e vice-versa).

Constantes relevantes em `packages/shared/src/auth/jwt.constants.ts`:
`TOKEN_TYPE`, `TRANSITION_TOKEN_TTL = "120s"`, `EXAM_SESSION_TTL = "4h"`, `getJwtSecret()`.

---

## 4. Comunicação Frontend ↔ Backend

- **admin-web / web** — Axios (`src/lib/api.ts`) com `baseURL = NEXT_PUBLIC_API_URL`
  (deve incluir o prefixo `/api`, ex.: `http://localhost:3333/api`). Interceptor injeta
  `Authorization: Bearer <token>` e redireciona para `/login` em 401.
- **exam-web** — usa um **proxy server-side** (`apps/exam/web/src/app/api/[...path]/route.ts`):
  o Next.js repassa `/api/*` para `EXAM_API_URL` (ex.: `http://exam-api:3334/api`).
  Isso evita expor a API interna diretamente ao navegador e centraliza o CORS.

### CORS

Cada API configura CORS para os seus respectivos frontends. O Módulo Provas é
isolado e só precisa aceitar origens do `exam-web` e do `admin-api` (transição).

---

## 5. Estratégia de Build (Docker)

Build multi-estágio com **contexto na raiz do repositório** (`docker build -f apps/<x>/Dockerfile .`).

- `packages/shared` é compilado dentro do stage de build e **copiado** (não symlink)
  para `<app>/node_modules/@olicmat/shared/` — os symlinks de `@nestjs/*` resolvem as
  dependências da árvore `node_modules` achatada do app.
- Backends fazem `prisma generate` + `nest build`; o `exam-api` copia explicitamente
  `generated/prisma` para `dist/generated` (por causa do generator `prisma-client-js`).
- Frontends fazem `next build`; o runner copia `.next`, `node_modules`, `package.json`,
  `next.config.ts` e `public` (quando existir).

---

## 6. Principais Diretórios (backend)

```
apps/admin/api/src/
  auth/             # register, login, recuperação, transition-token, JWT strategy
  users/            # perfil + gestão de usuários (admin)
  olimpiada/        # core: inscricao, prova, envio, ranking
  admin/            # provas, questoes, avaliacao, dashboard, auditoria, cursos
  coordenacao/      # visões do coordenador
  instituicoes/     # catálogo de instituições e cursos
  upload/           # Cloudinary
  common/           # guards (JWT, Roles), decorators (@Roles)
  health/           # liveness/readiness

apps/exam/api/src/
  auth/             # claim (transition → session), JWT strategy
  prova/            # iniciar, questoes, responder, finalizar, resumo, monitoring
  auditoria/        # trilha de auditoria local do módulo de prova
  health/           # liveness/readiness
```

---

## 7. Regras de Migração

- Nunca editar uma migration já aplicada — criar nova com `prisma migrate dev`.
- `schema.prisma` é a fonte de verdade.
- `admin-api` é o único que aplica migrations (`start.sh`).

---

## 8. Escopo (Guardrails)

O escopo ativo é **apenas OLICMAT**. Não reintroduzir modelos/rotas/páginas de
FORPEMAT (`Modulo`, `ProgressoCurso`, `Certificado`, `/cursos`, `/certificados`) nem
CONGEMAT (`Submissao`, `/congresso`, `/submissoes`).
