<div align="center">
  <img src="frontend/public/logo-semfundo.png" alt="OLICMAT" height="120" />
  <h1>OLICMAT</h1>
  <p><strong>Olimpíada para Licenciandos em Matemática</strong></p>
  <p>Plataforma web full-stack para gestão de olimpíadas acadêmicas — inscrição, provas, avaliação e ranking.</p>
</div>

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 (App Router, React 19, Tailwind CSS v4, shadcn/ui v4) |
| Backend | NestJS 11 (TypeScript, ESM, Zod) |
| Database | PostgreSQL 16 + Prisma 7.8 |
| Auth | JWT (Passport) + RBAC |
| Storage | Cloudinary |
| Orquestração | Docker Compose |

## Funcionalidades

- **Autenticação** — Cadastro, login, recuperação de senha, JWT com refresh
- **Inscrição** — Fluxo completo com upload de comprovante de matrícula
- **Fase 1** — Prova objetiva online com correção automática
- **Fase 2** — Envio de materiais didático-tecnológicos com avaliação por avaliadores
- **Ranking** — Público com medalhas (ouro/prata/bronze)
- **Painéis** — Dashboards por perfil: ADMIN, AVALIADOR, ALUNO, COORDENADOR_CURSO
- **Administração** — CRUD de provas, questões, usuários, edições, instituições, cursos (incluindo nota ENADE); auditoria; exportação CSV
- **Visualização de entidades** — Telas de detalhe unificadas com componente `<DetailPanel>` (seções rotuladas, métrica herói com cor semântica, estados vazios amigáveis)

## Perfis de Acesso

| Perfil | Dashboard | Atribuições |
|--------|-----------|-------------|
| ALUNO | `/competidor` | Cadastro, inscrição, prova, envio Fase 2, resultado |
| COORDENADOR_CURSO | `/coordenador` | Visualizar alunos, monitorar inscrições |
| AVALIADOR | `/avaliador` | Criar questões, gerenciar provas, avaliar Fase 2 |
| ADMIN | `/admin` | Full access: usuários, inscrições, provas, auditoria, exportação |

## Arquitetura (Produção)

A aplicação roda no **Easypanel** com 3 containers independentes:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  olicmat-db  │◄────│  olicmat-api │◄────│ olicmat-web  │
│  PostgreSQL  │     │  NestJS      │     │  Next.js     │
│  :5432       │     │  :3333       │     │  :3000       │
└──────────────┘     └──────────────┘     └──────────────┘
```

- Cada container é independente e orquestrado via `docker-compose.yml`
- Migrations do Prisma rodam automaticamente no startup do backend
- Variáveis de ambiente configuradas no Easypanel

## Desenvolvimento Local

```bash
# Clone
git clone https://github.com/CEAD-UFPI/olicmat.git
cd olicmat

# Inicie os containers
docker compose up -d

# Acesse
# - Frontend: http://localhost:3002
# - Backend:  http://localhost:3333/api
# - DB:       localhost:5433
```

### Sem Docker

```bash
# Backend
cd backend
cp .env.example .env  # configure DATABASE_URL
npm install
npx prisma migrate deploy
npm run start:dev

# Frontend
cd frontend
cp .env.example .env  # configure NEXT_PUBLIC_API_URL
npm install
npm run dev
```

## Variáveis de Ambiente

### Backend

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão PostgreSQL |
| `JWT_SECRET` | Chave secreta para assinatura JWT |
| `CLOUDINARY_CLOUD_NAME` | Cloud name do Cloudinary |
| `CLOUDINARY_API_KEY` | API key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret do Cloudinary |

### Frontend

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL pública da API (ex.: `https://api.olicmat.com.br/api`) |

## Scripts

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Iniciar em modo dev |
| `npm run build` | Compilar para produção |
| `npm run start:prod` | Iniciar produção |
| `npx prisma migrate deploy` | Aplicar migrations |
| `npx prisma migrate dev` | Criar nova migration |
| `npx prisma seed` | Executar seed |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar em modo dev |
| `npm run build` | Build de produção |
| `npm run start` | Servir build |
| `npm run lint` | Verificar lint |

## Estrutura do Projeto

```
olicmat/
├── backend/             # API NestJS
│   ├── prisma/          # Schema, migrations, seed
│   ├── src/
│   │   ├── admin/       # Admin: provas, questões, avaliação, dashboard, auditoria, cursos
│   │   ├── auth/        # Autenticação (register, login, JWT, password reset)
│   │   ├── coordenacao/ # Views do coordenador
│   │   ├── instituicoes/# Catálogo de instituições e cursos
│   │   ├── olimpiada/   # Core: inscrição, prova, envio, ranking
│   │   ├── upload/      # Cloudinary
│   │   ├── users/       # Perfil de usuário
│   │   └── common/      # Guards, decorators
│   └── Dockerfile
├── frontend/            # Next.js 16 App Router
│   ├── src/
│   │   ├── app/         # Rotas: (auth), (dashboard), (public), ranking
│   │   ├── components/  # UI, layout, landing, prova
│   │   ├── stores/      # Zustand (authStore, provaStore)
│   │   ├── lib/         # API client (Axios), utils
│   │   └── types/       # TypeScript interfaces
│   └── Dockerfile
├── docs/                # PRD, BRD, SRS, refactor plans
├── docker-compose.yml   # Desenvolvimento
└── docker-compose.prod.yml
```

## Documentação

A documentação completa está em `docs/`:

| Documento | Descrição |
|-----------|-----------|
| `PRD_OLICMAT.md` | Product Requirements Document |
| `BRD_OLICMAT.md` | Business Requirements Document |
| `SRS_OLICMAT.md` | Software Requirements Specification |
| `role-permissions-matrix.md` | Matriz de permissões por perfil |
| `frontend-route-map.md` | Mapa de rotas do frontend |
| `api-surface.md` | Superfície da API |
| `refactor-plan.md` | Plano de refatoração |
| `CHANGELOG.md` | Registro de mudanças da plataforma |

## Licença

UNLICENSED — uso interno.
