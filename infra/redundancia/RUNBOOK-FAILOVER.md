# RUNBOOK — Failover para a VPS (Hostinger)

Cobre dois momentos: **(A) implantação hoje** e **(B) troca no dia da falha**.

> Convenção: rode tudo como `root` (ou com `sudo`). Substitua `<VPS_IP>` pelo
> IP público da sua VPS.

---

## A. Implantação (hoje à noite)

### A1. Na VPS — preparar diretórios e chaves

```bash
mkdir -p /opt/olicmat/backups /opt/olicmat/uploads
# Clona o repositório (ou copie a pasta infra/redundancia + apps + packages).
git clone <URL_DO_REPOSITORIO> /opt/olicmat/app
```

Crie a senha nova do banco (URL-safe) e o `.env.vps`:

```bash
cd /opt/olicmat/app/infra/redundancia
cp .env.vps.example .env.vps
# Edite .env.vps:
#   DB_PASSWORD  -> $(openssl rand -hex 24)   (NOVA, não a de produção)
#   JWT_SECRET   -> copie o de produção
#   BREVO_API_KEY, SMTP_FROM -> copie de produção
```

Build das imagens (deixe pronto, mas NÃO suba a stack inteira):

```bash
cd /opt/olicmat/app/infra/redundancia
# Memória: builde um serviço por vez para não estourar RAM no npm ci.
for s in admin-api exam-api admin-web web exam-web; do
  docker compose -f docker-compose.vps.yml --env-file .env.vps build "$s" || break
done
```

Suba só o banco (o restore vai alimentá-lo):

```bash
docker compose -f docker-compose.vps.yml --env-file .env.vps up -d postgres
```

Cron de restore na VPS (a cada 6 min):

```bash
crontab -e
# */6 * * * * /opt/olicmat/app/infra/redundancia/restaurar-na-vps.sh >> /var/log/olicmat-restore.log 2>&1
```

### A2. Na Máquina 3 — backup do banco

```bash
# 1) Chave SSH da Máquina 3 → VPS (uma vez):
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519
ssh-copy-id root@<VPS_IP>

# 2) Copie o script (ou clone o repo). Se já tem o repo em /opt/olicmat:
mkdir -p /opt/olicmat && cp -r infra/redundancia /opt/olicmat/ 2>/dev/null

# 3) Edite VPS_HOST no script:
sed -i 's/VPS_HOST="${VPS_HOST:-}"/VPS_HOST="<VPS_IP>"/' /opt/olicmat/infra/redundancia/backup-db-para-vps.sh

# 4) Teste manual:
/opt/olicmat/infra/redundancia/backup-db-para-vps.sh

# 5) Cron a cada 5 min:
crontab -e
# */5 * * * * /opt/olicmat/infra/redundancia/backup-db-para-vps.sh >> /var/log/olicmat-backup.log 2>&1
```

Confirme que o dump chega na VPS: `ls -la /opt/olicmat/backups/` deve mostrar
`olicmat-*.dump` recentes, e o restore deve passar (ver `restore.log`).

### A3. Na Máquina 1 — uploads (opcional hoje)

```bash
# Chave SSH da Máquina 1 → VPS + ajustar SRC no script (ver comentário do
# rsync-uploads-para-vps.sh). Depois:
crontab -e
# */10 * * * * /opt/olicmat/infra/redundancia/rsync-uploads-para-vps.sh >> /var/log/olicmat-uploads.log 2>&1
```

---

## B. Falha da UFPI — trocar para a VPS

Quando a UFPI cair (energia/rede/banco):

### B1. Na VPS — garantir banco recente e subir a stack

```bash
cd /opt/olicmat/app/infra/redundancia

# 0) CRÍTICO: desativa o cron de restore enquanto a app estiver no ar.
#    O restore faz DROP no banco — se rodar com a app de pé, apaga as
#    respostas que chegaram desde o último backup. Reative-o só ao voltar
#    ao standby (ver "Volta", passo 3).
crontab -l 2>/dev/null | grep -v restaurar-na-vps.sh | crontab -

# 1) Restaura o último dump disponível (em ~segundos):
./restaurar-na-vps.sh

# 2) Sobe a stack completa (imagens já buildadas → rápido):
docker compose -f docker-compose.vps.yml --env-file .env.vps up -d

# 3) Confere se tudo subiu saudável:
docker compose -f docker-compose.vps.yml ps
docker logs olicmat-admin-api --tail 40   # deve terminar em "Nest application successfully started"
```

### B2. Testar localmente antes de redirecionar o DNS

```bash
curl -s -H 'Host: olicmat.cead.ufpi.br' http://127.0.0.1:8080/ | head -5
curl -s -H 'Host: admin.olicmat.cead.ufpi.br' http://127.0.0.1:8080/ | head -5
curl -s -H 'Host: prova.olicmat.cead.ufpi.br' http://127.0.0.1:8080/ | head -5
```

Se os três responderem HTML (não erro), a stack está no ar.

### B3. Pedir ao CEAD para redirecionar o DNS

Pedir que os registros/upstreams apontem para `<VPS_IP>`:

| Domínio | Destino |
|---------|---------|
| `olicmat.cead.ufpi.br` | `<VPS_IP>:8080` |
| `admin.olicmat.cead.ufpi.br` | `<VPS_IP>:8080` |
| `prova.olicmat.cead.ufpi.br` | `<VPS_IP>:8080` |

(O CEAD mantém o TLS no proxy deles; a VPS expõe o router na porta 8080, já que
o Easypanel usa a 80/443. Se o CEAD não alcançar a 8080, libere no firewall:
`ufw allow 8080/tcp` ou o equivalente do painel Hostinger.)

### B4. Validar de fora

```bash
# De qualquer máquina com internet (não da UFPI):
curl -I https://olicmat.cead.ufpi.br
curl -I https://admin.olicmat.cead.ufpi.br
curl -I https://prova.olicmat.cead.ufpi.br
```

Teste um login de aluno e a abertura da prova. Se `prova.olicmat.*` responder e
o login funcionar, o failover está completo.

---

## Volta (quando a UFPI voltar)

1. Aguardar a UFPI estabilizar o banco (Máquina 3).
2. Reverter o DNS no CEAD de volta para a Máquina 1.
3. Na VPS, derrubar a app (`docker compose -f docker-compose.vps.yml down`) e
   **reativar o cron de restore** (que foi desligado no B1), para ela voltar a
   ser standby espelhado:

   ```bash
   cd /opt/olicmat/app/infra/redundancia
   docker compose -f docker-compose.vps.yml --env-file .env.vps down
   docker compose -f docker-compose.vps.yml --env-file .env.vps up -d postgres
   ( crontab -l 2>/dev/null | grep -v restaurar-na-vps.sh ; echo '*/6 * * * * /opt/olicmat/app/infra/redundancia/restaurar-na-vps.sh >> /var/log/olicmat-restore.log 2>&1' ) | crontab -
   ```

> **Atenção a respostas fora da UFPI:** durante o período na VPS, as respostas
> ficam no banco da VPS. Ao retornar para a UFPI, é preciso **copiar as
> respostas geradas na VPS de volta** para o banco da UFPI (dump da VPS →
> restore na UFPI), senão participantes que responderam na janela de failover
> perdem as respostas. Esse passo exige cuidado e deve ser feito com o sistema
> parado.
