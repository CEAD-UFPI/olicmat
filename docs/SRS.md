# SRS — Software Requirements Specification

## OLICMAT — Olimpíada para Licenciandos em Matemática

| Campo | Valor |
|---|---|
| **Versão** | 1.0 |
| **Data** | 12/05/2026 |
| **Autor** | Equipe OLICMAT |
| **Status** | Em desenvolvimento |

---

## 1. Introdução

### 1.1 Propósito

Este documento especifica os requisitos de software para a plataforma OLICMAT, uma aplicação web full-stack que integra competição olímpica, formação pedagógica e congresso acadêmico para licenciandos em Matemática.

### 1.2 Escopo Técnico

Aplicação web com frontend Next.js, backend NestJS e banco de dados PostgreSQL, containerizada com Docker Compose. O sistema atende três perfis de usuário (ALUNO, AVALIADOR, ADMIN) com autenticação JWT.

### 1.3 Definições e Acrônimos

| Termo | Definição |
|---|---|
| **OLICMAT** | Olimpíada para Licenciandos em Matemática (competição) |
| **FORPEMAT** | Formação Pedagógica em Matemática (LMS) |
| **CONGEMAT** | Congresso de Ensino de Matemática (evento acadêmico) |
| **Fase 1** | Prova objetiva online com 30 questões |
| **Fase 2** | Produção de videoaula + portfólio digital |
| **JWT** | JSON Web Token |
| **SRS** | Software Requirements Specification |

---

## 2. Requisitos Funcionais

### RF-01 — Autenticação

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-01.1 | Registro de usuário em 2 etapas | Etapa 1: nome, email, CPF, senha. Etapa 2: instituição, curso, matrícula, data de nascimento. Role padrão: ALUNO. |
| RF-01.2 | Login com email e senha | Retorna JWT access_token. Token armazenado no localStorage. |
| RF-01.3 | Proteção de rotas por JWT | Verificar token em todas as rotas privadas. Expirado → redirecionar /login. |
| RF-01.4 | Controle de acesso por role | ADMIN acessa todas as rotas. AVALIADOR acessa rotas de avaliação. ALUNO acessa próprias rotas. |
| RF-01.5 | CPF único no sistema | Validação de unicidade no backend. Erro amigável se CPF já cadastrado. |
| RF-01.6 | Senha com hash bcrypt | Senha nunca armazenada em texto plano. Custo mínimo: 10 rounds. |

### RF-02 — Inscrição OLICMAT

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-02.1 | Formulário de inscrição | Campos: UF (select 27 UFs), município (texto), instituição (texto), curso (texto), período (1-12). Usuário deve estar autenticado. |
| RF-02.2 | Status de inscrição | Estados: PENDENTE, CONFIRMADA, REJEITADA. Transição PENDENTE → CONFIRMADA somente por ADMIN. |
| RF-02.3 | Restrição de horário por estado | Cada UF pode ter horário específico de prova configurado pelo ADMIN. |
| RF-02.4 | Validação de inscrição única | Um usuário só pode ter uma inscrição ativa por edição. |

### RF-03 — Prova Fase 1

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-03.1 | Exibição de 30 questões | Questão atual + navegação entre questões (anterior/próximo/direta). Alternativas A-E. |
| RF-03.2 | Cronômetro regressivo de 180 minutos | Exibição em MM:SS. Alerta visual aos 5 min finais. Ao zerar, finaliza automaticamente. |
| RF-03.3 | Salvamento de respostas | Cada resposta salva individualmente via upsert (inscricaoId + questaoId). Feedback visual de salva. |
| RF-03.4 | Finalização manual | Modal de confirmação listando questões não respondidas. Ao confirmar, calcula nota e bloqueia acesso. |
| RF-03.5 | Finalização automática por tempo | Mesmo comportamento da finalização manual. Nota calculada com questões não respondidas como erradas. |
| RF-03.6 | Nota da Fase 1 | Número de acertos / 30. Armazenada em `inscricao.fase1Nota`. |
| RF-03.7 | Acesso único à prova | Usuário só pode iniciar a prova se inscrição estiver CONFIRMADA e `fase1Inicio` for nulo. |

### RF-04 — Prova Fase 2

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-04.1 | Sorteio de tema | Endpoint retorna tema aleatório dos 10 disponíveis. Tema fica vinculado à inscrição (`fase2Tema`). |
| RF-04.2 | Upload de videoaula | Formato MP4, limite de tamanho configurável. Upload via Cloudinary (buffered streaming). URL armazenada em `fase2VideoUrl`. |
| RF-04.3 | Upload de portfólio | Formato PDF, limite de tamanho configurável. Upload via Cloudinary. URL armazenada em `fase2PortfolioUrl`. |
| RF-04.4 | Nota da Fase 2 | Atribuída manualmente por AVALIADOR. Escala 0-10. |
| RF-04.5 | Nota final | `notaFinal = fase1Nota * 0.4 + fase2Nota * 0.6` |

### RF-05 — Ranking e Medalhas

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-05.1 | Ranking por estado | Lista de inscritos confirmados do estado, ordenados por notaFinal decrescente. Público (sem autenticação). |
| RF-05.2 | Distribuição de medalhas | Top 5% → OURO. Próximos 10% → PRATA. Próximos 15% → BRONZE. Calculado sobre total de confirmados do estado. |
| RF-05.3 | Visualização de medalha | Medalha exibida no dashboard do competidor e no ranking público. |

### RF-06 — FORPEMAT

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-06.1 | Catálogo de módulos | 14 módulos com título, descrição, carga horária, ordem. Ordenados por `ordem`. Público. |
| RF-06.2 | Conteúdo do módulo | Conteúdo rico armazenado como JSON (texto, imagens, links). Questionário com questões de múltipla escolha. |
| RF-06.3 | Progresso do usuário | Registro por módulo (userId + moduloId). Estado: concluído (true/false) + nota. Barra de progresso geral. |
| RF-06.4 | Certificado | Emitido automaticamente quando todos os 14 módulos são concluídos. Código único (hex aleatório 32 chars). Carga horária total: 120h. |

### RF-07 — CONGEMAT

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-07.1 | Submissão de trabalho | Campos: tipo (ARTIGO/POSTER), título, resumo, arquivo PDF (Cloudinary). |
| RF-07.2 | Listagem de submissões | Usuário vê todas as suas submissões com status atual. |
| RF-07.3 | Avaliação | AVALIADOR pode mudar status para APROVADO ou REJEITADO. |

### RF-08 — Administração

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| RF-08.1 | Validação de inscrições | ADMIN lista inscrições pendentes e confirma/rejeita individualmente. |
| RF-08.2 | Cadastro de questões | ADMIN cadastra questões com enunciado, 5 alternativas, correta, eixo, dificuldade. |
| RF-08.3 | Gestão de usuários | ADMIN lista usuários, altera role. |

---

## 3. Requisitos Não-Funcionais

### 3.1 Performance

| ID | Requisito | Métrica |
|---|---|---|
| RNF-01 | Tempo de resposta da API | P95 < 500ms para endpoints de leitura |
| RNF-02 | Salvamento de resposta da prova | P95 < 200ms (crítico para evitar perda de dados) |
| RNF-03 | Carregamento da página de prova | First Contentful Paint < 2s |
| RNF-04 | Upload de arquivos | Suporte a arquivos de até 500MB (videoaula) com barra de progresso |
| RNF-05 | Concorrência na prova | Suporte a 500 usuários simultâneos realizando a prova |

### 3.2 Segurança

| ID | Requisito |
|---|---|
| RNF-06 | Senhas com hash bcrypt (mínimo 10 rounds) |
| RNF-07 | JWT com secret de no mínimo 256 bits, expiração configurável (recomendado 24h) |
| RNF-08 | Dados sensíveis (CPF) criptografados ou mascarados em logs |
| RNF-09 | Proteção contra CSRF nas rotas de mutação |
| RNF-10 | Rate limiting nas rotas de autenticação (5 tentativas/min por IP) |
| RNF-11 | Validação de tipo e tamanho de arquivo no upload (whitelist: MP4, PDF) |
| RNF-12 | CORS configurado apenas para origens permitidas |

### 3.3 Disponibilidade

| ID | Requisito |
|---|---|
| RNF-13 | Disponibilidade de 99% durante o período de provas (julho 2026) |
| RNF-14 | Backups diários do banco de dados PostgreSQL |
| RNF-15 | Containerização com Docker Compose para facilitar reinício e migração |

### 3.4 Usabilidade

| ID | Requisito |
|---|---|
| RNF-16 | Interface responsiva (mobile-first) com Tailwind CSS breakpoints: sm, md, lg, xl |
| RNF-17 | Tema escuro como padrão visual |
| RNF-18 | Mensagens de erro de validação em português claro |
| RNF-19 | WAI-ARIA básico: labels, roles, focus management |
| RNF-20 | Feedback visual para ações assíncronas (loading, sucesso, erro) |

### 3.5 Manutenibilidade

| ID | Requisito |
|---|---|
| RNF-21 | Código TypeScript em frontend e backend |
| RNF-22 | Validação Zod em DTOs do backend e formulários do frontend |
| RNF-23 | Migrações Prisma versionadas para evolução do banco |
| RNF-24 | Separação em módulos NestJS com responsabilidade única |

---

## 4. Arquitetura do Sistema

### 4.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                     Cliente (Browser)                     │
│  ┌───────────────────────┐  ┌───────────────────────────┐│
│  │   Next.js App Router   │  │   Zustand Stores          ││
│  │   (React 19, RSC)      │  │   (auth, prova)           ││
│  │                        │  │                           ││
│  │   shadcn/ui + Tailwind │  │   React Hook Form + Zod   ││
│  └───────────┬───────────┘  └───────────────────────────┘│
└──────────────┼──────────────────────────────────────────┘
               │ HTTPS (Axios + JWT Bearer)
┌──────────────┼──────────────────────────────────────────┐
│              ▼              Servidor (NestJS)             │
│  ┌──────────────────────────────────────────────────┐    │
│  │                  Global Pipe (Zod)                 │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌────────┐ ┌──────────┐ ┌────────────┐ ┌───────────┐   │
│  │  Auth  │ │ Olimpiada│ │    LMS     │ │ Congresso │   │
│  │ Module │ │  Module  │ │   Module   │ │  Module   │   │
│  │        │ │          │ │            │ │           │   │
│  │ JWT +  │ │ Inscricao│ │  Modulos   │ │ Submissao │   │
│  │Passport│ │ Prova    │ │ Progresso  │ │ Avaliacao │   │
│  │        │ │ Envio    │ │Certificado │ │           │   │
│  │        │ │ Ranking  │ │            │ │           │   │
│  └────────┘ └──────────┘ └────────────┘ └───────────┘   │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Upload Module (Cloudinary)            │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────┐
│                 PostgreSQL 16                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  User │ Inscricao │ Questao │ Resposta │ Modulo    │  │
│  │  ProgressoCurso │ Certificado │ Submissao          │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────┐
│              Cloudinary (Storage)                         │
│  Videos (MP4) │ Portfolios (PDF) │ Artigos (PDF)        │
│  Comprovantes │ Imagens                                 │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| **Frontend Framework** | Next.js (App Router) | 16.x |
| **Frontend Linguagem** | TypeScript | 5.x |
| **Estilização** | Tailwind CSS | 4.x |
| **Componentes** | shadcn/ui, Base UI React | 4.x |
| **Estado** | Zustand | 5.x |
| **Formulários** | React Hook Form + Zod | 7.x / 4.x |
| **Animação** | Framer Motion | 12.x |
| **HTTP Client** | Axios | 1.x |
| **Backend Framework** | NestJS (Express) | 11.x |
| **Backend Linguagem** | TypeScript (ESM) | 5.x |
| **ORM** | Prisma | 7.8 |
| **Banco de Dados** | PostgreSQL | 16 |
| **Autenticação** | Passport.js + JWT | — |
| **Validação** | Zod | 4.x |
| **Upload** | Multer + Cloudinary SDK | — |
| **Containerização** | Docker + Docker Compose | — |

### 4.3 Estrutura de Diretórios

```
olicmat/
├── frontend/                    # Next.js 16 (App Router)
│   ├── src/
│   │   ├── app/                 # Rotas (App Router)
│   │   │   ├── login/           # /login
│   │   │   ├── registro/        # /registro
│   │   │   ├── ranking/         # /ranking (público)
│   │   │   ├── cursos/          # /cursos (FORPEMAT)
│   │   │   │   └── [moduloId]/  # /cursos/:id
│   │   │   ├── congresso/       # /congresso
│   │   │   └── competidor/      # /competidor (dashboard)
│   │   │       ├── inscricao/   # /competidor/inscricao
│   │   │       ├── prova/       # /competidor/prova
│   │   │       └── envio/       # /competidor/envio
│   │   ├── components/          # Componentes React
│   │   ├── lib/                 # Utilitários, API client
│   │   └── stores/              # Zustand stores
│   └── public/                  # Assets estáticos
├── backend/                     # NestJS 11
│   ├── prisma/
│   │   ├── schema.prisma        # Schema do banco
│   │   └── seed.ts              # Dados iniciais
│   └── src/
│       ├── auth/                # Módulo de autenticação
│       ├── users/               # Módulo de usuários
│       ├── olimpiada/
│       │   ├── inscricao/       # Sub-módulo: inscrição
│       │   ├── prova/           # Sub-módulo: prova
│       │   ├── envio/           # Sub-módulo: fase 2
│       │   └── ranking/         # Sub-módulo: ranking
│       ├── lms/                 # Módulo FORPEMAT
│       ├── congresso/           # Módulo CONGEMAT
│       └── upload/              # Módulo de upload
└── docker-compose.yml           # Orquestração
```

---

## 5. Especificações de API

### 5.1 Convenções

- Base URL: `http://localhost:3333/api`
- Content-Type: `application/json` (exceto uploads: `multipart/form-data`)
- Autenticação: `Authorization: Bearer <token>`
- Respostas de erro: `{ statusCode, message, error }`

### 5.2 Endpoints de Autenticação

#### `POST /api/auth/registro`
```json
// Request
{
  "nome": "string",
  "email": "string (email)",
  "cpf": "string (11 dígitos)",
  "senha": "string (mín. 6 caracteres)",
  "instituicao": "string",
  "curso": "string",
  "matricula": "string",
  "dataNascimento": "string (ISO date)"
}
// Response 201
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "role": "ALUNO"
}
```

#### `POST /api/auth/login`
```json
// Request
{
  "email": "string",
  "senha": "string"
}
// Response 200
{
  "access_token": "string (JWT)"
}
```

### 5.3 Endpoints da Olimpíada

#### `POST /api/olimpiada/inscricao`
Cria inscrição do usuário autenticado.
```json
// Request
{
  "estado": "SP",
  "municipio": "São Paulo",
  "instituicao": "UNESP",
  "curso": "Licenciatura em Matemática",
  "periodo": 5
}
// Response 201
{
  "id": "uuid",
  "status": "PENDENTE",
  ...
}
```

#### `GET /api/olimpiada/inscricao/status`
Retorna status da inscrição do usuário autenticado.

#### `PATCH /api/olimpiada/inscricao/:id/validar` [ADMIN]
Valida ou rejeita inscrição.
```json
// Request
{ "status": "CONFIRMADA" }
```

#### `POST /api/olimpiada/prova/iniciar`
Inicia a prova (registra `fase1Inicio`, retorna 30 questões).
```json
// Response 200
{
  "inicio": "2026-07-15T14:00:00Z",
  "fim": "2026-07-15T17:00:00Z",
  "questoes": [
    {
      "id": "uuid",
      "enunciado": "string",
      "alternativas": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
      "eixo": "ALGEBRA",
      "dificuldade": "MEDIO"
    }
  ]
}
```

#### `POST /api/olimpiada/prova/responder`
Salva resposta (upsert). Pode ser chamada a qualquer momento durante a prova.
```json
// Request
{
  "questaoId": "uuid",
  "alternativa": "A"
}
```

#### `POST /api/olimpiada/prova/finalizar`
Finaliza a prova, calcula nota da Fase 1.
```json
// Response 200
{
  "acertos": 24,
  "total": 30,
  "nota": 0.8
}
```

#### `GET /api/olimpiada/envio/tema`
Retorna o tema sorteado para Fase 2.

#### `POST /api/olimpiada/envio/video` [multipart/form-data]
Upload da videoaula (MP4).

#### `POST /api/olimpiada/envio/portfolio` [multipart/form-data]
Upload do portfólio (PDF).

#### `GET /api/olimpiada/ranking?uf=SP`
Ranking público por estado.
```json
// Response 200
{
  "estado": "SP",
  "totalInscritos": 150,
  "ranking": [
    {
      "posicao": 1,
      "nome": "string",
      "instituicao": "string",
      "notaFinal": 9.5,
      "medalha": "OURO"
    }
  ]
}
```

### 5.4 Endpoints FORPEMAT

#### `GET /api/lms/modulos`
Lista os 14 módulos. Público.

#### `GET /api/lms/modulos/:id`
Detalhe do módulo com conteúdo. Requer autenticação.

#### `POST /api/lms/modulos/:id/concluir`
Marca módulo como concluído.
```json
// Request
{ "nota": 8.5 }
```

#### `GET /api/lms/progresso`
Progresso do usuário autenticado (total concluído, porcentagem).

#### `POST /api/lms/certificado`
Emite certificado (se todos os módulos concluídos).

### 5.5 Endpoints CONGEMAT

#### `POST /api/congresso/submissao` [multipart/form-data]
Submete artigo ou pôster.
```json
// Request (form fields)
{
  "tipo": "ARTIGO",
  "titulo": "string",
  "resumo": "string",
  "arquivo": "<PDF file>"
}
```

#### `GET /api/congresso/submissoes`
Lista submissões do usuário autenticado.

#### `PATCH /api/congresso/submissao/:id/avaliar` [AVALIADOR]
```json
// Request
{ "status": "APROVADO" }
```

---

## 6. Modelo de Dados

### 6.1 Diagrama Entidade-Relacionamento

```
User (1) ────── (1) Inscricao
User (1) ────── (N) ProgressoCurso
User (1) ────── (N) Certificado
User (1) ────── (N) Submissao
Inscricao (1) ── (N) Resposta
Questao (1) ──── (N) Resposta
Modulo (1) ───── (N) ProgressoCurso
```

### 6.2 Tabelas

#### User
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK, default: uuid() |
| nome | String | NOT NULL |
| email | String | UNIQUE, NOT NULL |
| cpf | String | UNIQUE, NOT NULL |
| senha | String | NOT NULL (bcrypt hash) |
| role | Enum(ALUNO, AVALIADOR, ADMIN) | Default: ALUNO |
| instituicao | String | NOT NULL |
| curso | String | NOT NULL |
| matricula | String | — |
| dataNascimento | DateTime | — |
| comprovanteUrl | String? | — |
| createdAt | DateTime | default: now() |
| updatedAt | DateTime | updatedAt |

#### Inscricao
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User, UNIQUE |
| status | Enum(PENDENTE, CONFIRMADA, REJEITADA) | Default: PENDENTE |
| estado | String (UF) | — |
| municipio | String | — |
| instituicao | String | — |
| curso | String | — |
| periodo | Int | — |
| fase1Nota | Float? | — |
| fase1Inicio | DateTime? | — |
| fase1Fim | DateTime? | — |
| fase2Tema | String? | — |
| fase2VideoUrl | String? | — |
| fase2PortfolioUrl | String? | — |
| fase2Nota | Float? | — |
| notaFinal | Float? | — |
| medalha | Enum(OURO, PRATA, BRONZE)? | — |
| createdAt | DateTime | default: now() |
| updatedAt | DateTime | updatedAt |

#### Questao
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| enunciado | String (Text) | NOT NULL |
| alternativaA | String | NOT NULL |
| alternativaB | String | NOT NULL |
| alternativaC | String | NOT NULL |
| alternativaD | String | NOT NULL |
| alternativaE | String | NOT NULL |
| correta | Enum(A, B, C, D, E) | NOT NULL |
| eixo | Enum(ALGEBRA, GEOMETRIA, ANALISE, ESTATISTICA, DIDATICA) | NOT NULL |
| dificuldade | Enum(FACIL, MEDIO, DIFICIL) | NOT NULL |

#### Resposta
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| inscricaoId | UUID | FK → Inscricao |
| questaoId | UUID | FK → Questao |
| alternativa | Enum(A, B, C, D, E) | NOT NULL |
| correta | Boolean | NOT NULL |
| createdAt | DateTime | default: now() |
| **Unique** | [inscricaoId, questaoId] | — |

#### Modulo
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| titulo | String | NOT NULL |
| descricao | String | — |
| ordem | Int | UNIQUE |
| cargaHoraria | Int | — |
| conteudos | Json | — |
| questionario | Json? | — |

#### ProgressoCurso
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User |
| moduloId | UUID | FK → Modulo |
| concluido | Boolean | Default: false |
| nota | Float? | — |
| createdAt | DateTime | default: now() |
| **Unique** | [userId, moduloId] | — |

#### Certificado
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User |
| cargaHoraria | Int | — |
| codigo | String | UNIQUE, random hex (32) |
| emitidoEm | DateTime | default: now() |

#### Submissao
| Coluna | Tipo | Restrições |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User |
| tipo | Enum(ARTIGO, POSTER) | NOT NULL |
| titulo | String | NOT NULL |
| resumo | String | NOT NULL |
| arquivoUrl | String | NOT NULL (Cloudinary PDF) |
| status | Enum(EM_AVALIACAO, APROVADO, REJEITADO) | Default: EM_AVALIACAO |

---

## 7. Infraestrutura e Deploy

### 7.1 Docker Compose

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: olicmat
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: olicmat
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  backend:
    build: ./backend
    ports: ["3333:3333"]
    depends_on: [postgres]
    environment:
      DATABASE_URL: postgresql://olicmat:${DB_PASSWORD}@postgres:5432/olicmat
      JWT_SECRET: ${JWT_SECRET}
    volumes: ["./backend/src:/app/src"]

  frontend:
    build: ./frontend
    ports: ["3002:3000"]
    depends_on: [backend]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3333/api
    volumes: ["./frontend/src:/app/src"]
```

### 7.2 Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://olicmat:<senha>@postgres:5432/olicmat

# Auth
JWT_SECRET=<chave-secreta-256-bit>
JWT_EXPIRATION=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=<nome>
CLOUDINARY_API_KEY=<chave>
CLOUDINARY_API_SECRET=<secret>

# App
PORT=3333
NODE_ENV=production
```

---

## 8. Requisitos de Teste

| ID | Tipo | Descrição |
|---|---|---|
| TST-01 | Unitário | Serviços de auth (registro, login, validação JWT) |
| TST-02 | Unitário | Cálculo de nota da prova (correção automática) |
| TST-03 | Unitário | Distribuição de medalhas (cálculo de percentis) |
| TST-04 | Unitário | Regras de emissão de certificado |
| TST-05 | Integração | Fluxo completo de inscrição (endpoint → banco) |
| TST-06 | Integração | Prova: iniciar → responder → finalizar |
| TST-07 | Integração | Upload Fase 2 (mock Cloudinary) |
| TST-08 | E2E | Jornada completa do competidor (Playwright/Cypress) |
| TST-09 | Carga | Prova simultânea com 500 usuários (k6/Artillery) |
| TST-10 | Segurança | Testes de penetração básicos (OWASP Top 10) |

---

## 9. Glossário Técnico

| Termo | Descrição |
|---|---|
| **App Router** | Sistema de roteamento do Next.js baseado em diretórios com Server Components |
| **Zustand** | Biblioteca de gerenciamento de estado minimalista para React |
| **NestJS** | Framework backend Node.js com arquitetura modular inspirada no Angular |
| **Prisma** | ORM TypeScript-first com migrações automáticas e type safety |
| **Cloudinary** | Serviço de armazenamento e transformação de mídia na nuvem |
| **JWT** | Token criptografado para autenticação stateless |
| **Upsert** | Operação que insere ou atualiza um registro (INSERT ON CONFLICT UPDATE) |
| **shadcn/ui** | Coleção de componentes React acessíveis e customizáveis |
