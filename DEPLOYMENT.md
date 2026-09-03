# DEPLOYMENT.md — OLICMAT v2.1

Guia de deploy para os 3 ambientes: **Desenvolvimento**, **Homologação** e **Produção**.

---

## 1. Desenvolvimento (Docker Compose local)

Sobe os 3 módulos + PostgreSQL em um único host.

```bash
cp .env.example .env          # opcional (o compose já traz defaults dev)
docker compose up -d --build
```

Serviços:

| Serviço | URL |
|---------|-----|
| WEB | http://localhost:3005 |
| Cadastro/Configurações | http://localhost:3006 |
| Provas | http://localhost:3007 |
| API Cadastro | http://localhost:3333/api |
| API Provas | http://localhost:3334/api |
| PostgreSQL | localhost:5433 |

> As portas `3005`/`3006`/`3007` são os hosts locais (evitam colisão com outros
> projetos na mesma máquina). Configure em `docker-compose.yml`/`.env` se precisar
> de outras.

Derreter/recriar tudo:

```bash
docker compose down -v
docker compose up -d --build
```

---

## 2. Homologação (VPS + Easypanel)

A homologação roda no **Easypanel** como um conjunto de serviços (um por container).
Use os mesmos `Dockerfile`s de produção (mesmo `docker build`), apenas com variáveis
de staging.

| Serviço | Dockerfile | Porta | Envs principais |
|---------|-----------|-------|-----------------|
| WEB | `apps/web/Dockerfile` | 3000 | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ADMIN_URL` |
| Cadastro (web) | `apps/admin/web/Dockerfile` | 3000 | `NEXT_PUBLIC_API_URL` |
| Cadastro (api) | `apps/admin/api/Dockerfile` | 3333 | `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `SMTP_*`, `FRONTEND_URL`, `EXAM_APP_URL` |
| Provas (web) | `apps/exam/web/Dockerfile` | 3003 | `EXAM_API_URL` |
| Provas (api) | `apps/exam/api/Dockerfile` | 3334 | `DATABASE_URL`, `JWT_SECRET` |

Passos:

1. Criar um service por container no Easypanel, apontando o build para o `Dockerfile`
   correspondente e o **build context para a raiz do repositório**.
2. Definir as variáveis de ambiente (copie de `.env.prod.example` e ajuste).
3. Garantir que `admin-api` e `exam-api` usem o **mesmo** `JWT_SECRET` e o **mesmo**
   `DATABASE_URL`.
4. Configurar o domínio de homologação no reverse proxy do Easypanel.
5. O `admin-api` aplica migrations automaticamente no startup (`start.sh`).

> **CORS:** ajuste `FRONTEND_URL` / `EXAM_APP_URL` para os domínios reais de homologação.

---

## 3. Produção (3 Máquinas)

Apenas a **Máquina 1** tem acesso externo (reverse proxy). Provas e banco ficam na
rede interna `10.42.0.0/16`.

```
                         PUBLIC INTERNET
                                │
                                ▼
                   ┌─────────────────────────┐
                   │  Reverse Proxy (Nginx)  │
                   │  olicmat.cead.ufpi.br   │
                   └────────────┬────────────┘
                                │
      ┌─────────────────────────┴──────────────────────────┐
      │ Máquina 1 (externa)                                │
      │  - web        (:3000)  landing pública             │
      │  - admin-web  (:3001)  cadastro/configurações      │
      │  - admin-api  (:3333)                              │
      └─────────────────────────┬──────────────────────────┘
                                │  rede interna 10.42.0.x
      ┌─────────────────────────┼──────────────────────────┐
      │ Máquina 2 (interna)     │                           │
      │  - exam-web  (:3003)    │                           │
      │  - exam-api  (:3334)    │                           │
      └─────────────────────────┼──────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   │ Máquina 3 (interna)     │
                   │  - postgres (:5432)     │
                   └─────────────────────────┘
```

> **Memória durante o build:** `docker compose build` compila os serviços em
> paralelo, e vários `npm ci` simultâneos derrubam o build por falta de memória
> (`npm error Exit handler never called!`). Em máquina com pouca RAM, builde um
> serviço por vez:
>
> ```bash
> for s in admin-api admin-web web; do
>   docker compose -f docker-compose.prod.yml build "$s" || break
> done
> ```

### Máquina 1 — WEB + Cadastro/Configurações

```bash
# Na Máquina 1
cp .env.prod.example .env   # preencha DATABASE_URL (Máquina 3) e JWT_SECRET
docker compose -f docker-compose.prod.yml up -d --build
```

Se o PostgreSQL rodar junto (opcional, perfil `with-db`):

```bash
docker compose -f docker-compose.prod.yml --profile with-db up -d --build
```

### Máquina 2 — Provas (isolado)

```bash
# Na Máquina 2 (rede interna)
# Mesmo JWT_SECRET e DATABASE_URL da Máquina 1
# EXAM_WEB_BIND_IP = IP interno desta máquina (ex.: 10.42.0.20)
docker compose -f docker-compose.exam.prod.yml up -d --build
```

> **Bind do `exam-web`:** o Nginx da Máquina 1 alcança este serviço por
> `http://<MÁQUINA_2_IP>:3003`. Publicar em `127.0.0.1` deixaria o módulo de
> Provas inacessível (connection refused). Defina `EXAM_WEB_BIND_IP` com o IP
> interno da Máquina 2; em branco, publica em `0.0.0.0`.
>
> O `exam-api` (`:3334`) permanece restrito à rede do Compose — quem fala com
> ele é o `exam-web`, por `http://exam-api:3334/api`. O `admin-api` **não** faz
> chamadas servidor-a-servidor para Provas: usa `EXAM_APP_URL` apenas para
> montar um redirect de navegador.

### Máquina 3 — PostgreSQL

PostgreSQL 16 com o mesmo `DB_USER`/`DB_PASSWORD`/`DB_NAME` usados no `DATABASE_URL`.
Aplique as migrations a partir da Máquina 1 (o `admin-api` faz isso no startup) ou:

```bash
docker run --rm --network <rede-interna> \
  -e DATABASE_URL=postgresql://olicmat:SENHA@10.42.0.10:5432/olicmat \
  -v "$PWD/apps/admin/api/prisma:/app/prisma" \
  node:22-alpine sh -c "cd /app && npx prisma migrate deploy"
```

### Reverse Proxy (Máquina 1)

Exemplo de roteamento Nginx:

| Host | Upstream |
|------|----------|
| `olicmat.cead.ufpi.br` | `http://127.0.0.1:3000` (web) |
| `admin.olicmat.cead.ufpi.br` | `http://127.0.0.1:3001` (admin-web) |
| `prova.olicmat.cead.ufpi.br` | `http://<MÁQUINA_2_IP>:3003` (exam-web, via rede interna) |

---

## 4. Variáveis de Ambiente (resumo)

| Variável | Onde | Descrição |
|----------|------|-----------|
| `DATABASE_URL` | admin-api, exam-api | Conexão PostgreSQL (Máquina 3) |
| `JWT_SECRET` | admin-api, exam-api | **IDÊNTICO** nos dois módulos. Obrigatório em produção, mín. 32 chars — as APIs **não sobem** sem ele (`openssl rand -base64 48`) |
| `EXAM_WEB_BIND_IP` | exam-web (Máquina 2) | IP interno onde o `exam-web` é publicado para o proxy da Máquina 1 |
| `DB_POOL_SIZE` | admin-api, exam-api | Tamanho do pool (default 10) |
| `FRONTEND_URL` | admin-api | Base para links de e-mail/redirects |
| `EXAM_APP_URL` | admin-api | Base do Módulo Provas (redirect transition) |
| `CLOUDINARY_*` | admin-api | Upload de arquivos |
| `SMTP_*` | admin-api | Envio de e-mails |
| `NEXT_PUBLIC_API_URL` | web, admin-web | URL pública da API (com `/api`) |
| `NEXT_PUBLIC_ADMIN_URL` | web | URL do painel administrativo |
| `NEXT_PUBLIC_MAIN_APP_URL` | exam-web | Para onde redirecionar após a prova |
| `EXAM_API_URL` | exam-web | URL interna da API de Provas (server-side) |

---

## 5. Migrations e Backup

- **Nunca edite** uma migration já aplicada; crie uma nova com `prisma migrate dev`.
- **Backup** antes de aplicar migrations em produção:
  ```bash
  pg_dump -h 10.42.0.10 -U olicmat olicmat > backup_$(date +%F).sql
  ```
- Reset (somente dev):
  ```bash
  docker exec olicmat-db psql -U olicmat -d olicmat -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  cd apps/admin/api && npx prisma migrate dev
  ```
