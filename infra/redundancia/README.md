# Redundância OLICMAT — Standby na VPS (Hostinger)

Espelha a aplicação inteira para uma VPS Hostinger para que, numa **falha total
da UFPI** (energia/rede/banco), a VPS assuma com perda de no máximo ~5 minutos
de dados.

**Estratégia:** backup lógico do banco a cada 5 min (`pg_dump`, somente leitura)
enviado por SSH para a VPS, que restaura num PostgreSQL local. A stack de
aplicação fica **buildada e parada** na VPS (standby "frio/quente"): na hora da
falha, é só subir os containers e pedir ao CEAD para redirecionar o DNS.

O failover é **manual no DNS** (os domínios `*.cead.ufpi.br` são do CEAD), então
este kit deixa a VPS pronta para o instante em que o CEAD apontar o DNS para o
IP da VPS.

## Arquivos

| Arquivo | Onde roda | O que faz |
|---------|-----------|-----------|
| `backup-db-para-vps.sh` | Máquina 3 (banco) | `pg_dump` + envio à VPS (cron 5 min) |
| `restaurar-na-vps.sh` | VPS | Restaura o último dump no Postgres local (cron) |
| `rsync-uploads-para-vps.sh` | Máquina 1 | Espelha o volume de uploads (Fase 2 / comprovantes) |
| `docker-compose.vps.yml` | VPS | Stack completa (web + admin + prova + postgres + router) |
| `router-vps.conf` | VPS | Nginx que distribui por domínio (prova local) |
| `.env.vps.example` | VPS | Modelo de variáveis (copie para `.env.vps`) |
| `RUNBOOK-FAILOVER.md` | — | Passo a passo da troca no dia da falha |

## O que eu preciso de você (antes de começar)

1. **IP público da VPS** e acesso SSH (`root` ou outro usuário com sudo).
2. Confirmar que o **nome do container do banco na Máquina 3 é `olicmat-db`**
   e o usuário/banco são `olicmat`/`olicmat` (o padrão do projeto).
3. Copiar **de produção** para a VPS (do `.env` da Máquina 1/2): `JWT_SECRET`,
   `BREVO_API_KEY`, `SMTP_FROM` e as URLs públicas.
   - A **senha do banco da VPS pode ser nova** (gere com `openssl rand -hex 24`):
     ela é do cluster local e **não** vem no dump.
4. Autorizar chave SSH: da **Máquina 3** e da **Máquina 1** → VPS
   (`ssh-copy-id` para que `scp`/`rsync` funcionem sem senha).

O passo a passo completo está no `RUNBOOK-FAILOVER.md`.
