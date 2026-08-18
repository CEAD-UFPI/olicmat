<div align="center">
  <h1>OLICMAT</h1>
  <p><strong>Olimpíada para Licenciandos em Matemática</strong></p>
  <p>Plataforma web full-stack para gestão de olimpíadas acadêmicas — inscrição, provas, avaliação e ranking.</p>
</div>

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js (App Router, React 19, Tailwind CSS v4, shadcn/ui v4) |
| Backend | NestJS 11 (TypeScript, ESM, Zod) |
| Database | PostgreSQL 16 + Prisma 7.8 |
| Auth | JWT (Passport) + RBAC — unificada entre módulos |
| Storage | Cloudinary |
| Orquestração | Docker Compose (dev + prod multi-máquina) |

## Arquitetura em 3 Módulos

A plataforma foi reorganizada em um **monorepo** (npm workspaces) com três módulos
independentes de build e deploy:

| Módulo | Pasta | Descrição | Acesso |
|--------|-------|-----------|--------|
| **WEB** | `apps/web` | Landing pública (institucional, cronograma, regulamento, ranking público) | Público |
| **Cadastro/Configurações** | `apps/admin/web` + `apps/admin/api` | Área administrativa completa: usuários, instituições, cursos, edições, provas, questões, inscrições, avaliações, dashboard, exportações, auditoria | ADMIN / COORDENADOR / AVALIADOR / ALUNO |
| **Provas** | `apps/exam/web` + `apps/exam/api` | Execução de prova **isolada** (apenas ALUNO e admin) | ALUNO |

- **`packages/shared`** — código compartilhado (constantes JWT, tipos de token, segredo JWT, TTLs).

```
apps/
  web/                # Módulo WEB (Next.js 16 — landing pública)
  admin/
    web/              # Cadastro/Configurações (Next.js 16)
    api/              # Cadastro/Configurações (NestJS 11 + Prisma)
  exam/
    web/              # Provas (Next.js 15 — isolado)
    api/              # Provas (NestJS 11 + Prisma — isolado)
packages/
  shared/             # Código compartilhado (auth, constantes, tipos)
```

## Funcionalidades

- **Autenticação unificada** — cadastro, login, recuperação de senha; o Módulo Provas valida tokens do backend principal
- **Inscrição** — fluxo completo com upload de comprovante de matrícula
- **Fase 1** — prova objetiva online com correção automática e anti-cola (ExamGuard)
- **Fase 2** — envio de materiais didático-tecnológicos com avaliação por avaliadores
- **Ranking** — público com medalhas (ouro/prata/bronze)
- **Painéis** — dashboards por perfil: ADMIN, AVALIADOR, ALUNO, COORDENADOR_CURSO
- **Administração** — CRUD de provas, questões, usuários, edições, instituições, cursos (incluindo nota ENADE); auditoria; exportação CSV
- **Detalhe de entidades** — componente unificado `<DetailPanel>`

## Perfis de Acesso

| Perfil | Dashboard | Atribuições |
|--------|-----------|-------------|
| ALUNO | `/competidor` | Cadastro, inscrição, prova, envio Fase 2, resultado |
| COORDENADOR_CURSO | `/coordenador` | Visualizar alunos, monitorar inscrições |
| AVALIADOR | `/avaliador` | Criar questões, gerenciar provas, avaliar Fase 2 |
| ADMIN | `/admin` | Acesso total: usuários, inscrições, provas, auditoria, exportação |

## Desenvolvimento Local (Docker Compose)

```bash
cp .env.example .env
docker compose up -d --build
```

| Serviço | URL |
|---------|-----|
| WEB (landing) | http://localhost:3005 |
| Cadastro/Configurações | http://localhost:3006 |
| Provas | http://localhost:3007 |
| API Cadastro | http://localhost:3333/api |
| API Provas | http://localhost:3334/api |
| PostgreSQL | localhost:5433 |

> As portas `3005`/`3006`/`3007` são os hosts locais de desenvolvimento (escolhidas
> para não colidir com outros projetos da máquina). Ajuste em `docker-compose.yml`
> e `.env` se necessário.

### Sem Docker

```bash
npm install                 # raiz (instala todos os workspaces)
npm run build:shared        # compila packages/shared
npm run dev:admin-api       # NestJS :3333
npm run dev:exam-api        # NestJS :3334
npm run dev:web             # Next.js :3000
npm run dev:admin-web       # Next.js :3001
npm run dev:exam-web        # Next.js :3003
```

> Fora do Docker, `DATABASE_URL` usa `localhost:5433` (veja `.env.example`).

## Deploy em Produção

Topologia em **3 máquinas** (apenas a Máquina 1 tem acesso externo):

| Máquina | Serviços | Arquivo Compose |
|---------|----------|-----------------|
| **1** | WEB + Cadastro/Configurações (reverse proxy público) | `docker-compose.prod.yml` |
| **2** | Provas (rede interna `10.42.0.0/16`) | `docker-compose.exam.prod.yml` |
| **3** | PostgreSQL (rede interna) | — |

Instruções completas: [DEPLOYMENT.md](DEPLOYMENT.md).

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Decisões de arquitetura e fluxos |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guia de deploy (dev / homologação / produção) |
| `docs/` | PRD, BRD, SRS, matriz de permissões, changelog |

## Escopo

O escopo ativo é **apenas OLICMAT**. Os módulos FORPEMAT (LMS) e CONGEMAT (congresso)
foram removidos no refactor v2.0 e **não devem ser reintroduzidos**.

## Licença

UNLICENSED — uso interno.
