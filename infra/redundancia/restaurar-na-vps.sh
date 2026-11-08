#!/usr/bin/env bash
#
# restaurar-na-vps.sh — restaura o último dump no PostgreSQL da VPS.
#
# Roda na VPS. O banco local é DROPADO e recriado a cada execução, então isto
# só deve rodar com a stack de APLICAÇÃO parada (o standby fica "frio/quente":
# imagens já buildadas, mas containers de app sem subir). No dia da falha:
# rode o restore (ou aguarde o cron), depois `docker compose up -d`.
#
# Cron sugerido (crontab -e na VPS), deslocado 1 min do backup:
#   */6 * * * * /opt/olicmat/infra/redundancia/restaurar-na-vps.sh >> /var/log/olicmat-restore.log 2>&1
# ============================================================================

set -euo pipefail

DB_CONTAINER="${DB_CONTAINER:-olicmat-db}"
DB_USER="${DB_USER:-olicmat}"            # superuser do cluster na VPS (POSTGRES_USER)
DB_NAME="${DB_NAME:-olicmat}"
BACKUP_DIR="${BACKUP_DIR:-/opt/olicmat/backups}"

LATEST="$(ls -1t "$BACKUP_DIR"/olicmat-*.dump 2>/dev/null | head -n1)"
if [[ -z "$LATEST" ]]; then
  echo "[$(date -u +%FT%TZ)] ERRO: nenhum dump em $BACKUP_DIR." >&2
  exit 1
fi

# O container do banco precisa estar de pé.
if [[ "$(docker inspect --format '{{.State.Running}}' "$DB_CONTAINER" 2>/dev/null)" != "true" ]]; then
  echo "[$(date -u +%FT%TZ)] ERRO: container $DB_CONTAINER não está rodando." >&2
  echo "Suba o postgres antes:  docker compose -f docker-compose.vps.yml --env-file .env.vps up -d postgres" >&2
  exit 1
fi

echo "[$(date -u +%FT%TZ)] restaurando $(basename "$LATEST") ..."

# 1) Encerra conexões pendentes (não deve haver nenhuma com a stack parada).
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME' AND pid <> pg_backend_pid();" >/dev/null || true

# 2) Dropa e recria o banco (espelho fiel, sem lixo de restore anterior).
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" >/dev/null
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" >/dev/null

# 3) Restaura schema + dados. --no-owner/--no-privileges remapeiam tudo para
#    o usuário local, eliminando dependência de roles da UFPI.
docker exec -i "$DB_CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME" \
  --no-owner --no-privileges --exit-on-error < "$LATEST"

echo "[$(date -u +%FT%TZ)] restauração ok (fonte: $(basename "$LATEST"))."
