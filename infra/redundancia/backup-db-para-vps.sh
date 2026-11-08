#!/usr/bin/env bash
#
# backup-db-para-vps.sh — espelha o banco OLICMAT (Máquina 3) para a VPS.
#
# Roda na Máquina 3 (onde vive o PostgreSQL, container "olicmat-db").
# `pg_dump` é SOMENTE LEITURA: não interfere na prova em andamento.
#
# Pré-requisitos:
#   1. Chave SSH da Máquina 3 autorizada na VPS (ssh root@VPS sem senha).
#   2. Variáveis abaixo preenchidas (ou exportadas antes de rodar).
#
# Cron sugerido (crontab -e na Máquina 3):
#   */5 * * * * /opt/olicmat/infra/redundancia/backup-db-para-vps.sh >> /var/log/olicmat-backup.log 2>&1
# ============================================================================

set -euo pipefail

# ---------- CONFIGURAÇÃO (edite) -------------------------------------------
VPS_HOST="${VPS_HOST:-}"                     # IP público da VPS (obrigatório)
VPS_USER="${VPS_USER:-root}"                 # usuário SSH na VPS
VPS_DIR="${VPS_DIR:-/opt/olicmat/backups}"   # diretório remoto dos dumps
DB_CONTAINER="${DB_CONTAINER:-olicmat-db}"   # nome do container do PostgreSQL
DB_USER="${DB_USER:-olicmat}"
DB_NAME="${DB_NAME:-olicmat}"
KEEP="${KEEP:-12}"                           # mantém os últimos N dumps
LOCAL_DIR="${LOCAL_DIR:-/var/backups/olicmat}"
# ---------------------------------------------------------------------------

if [[ -z "$VPS_HOST" ]]; then
  echo "[$(date -u +%FT%TZ)] ERRO: defina VPS_HOST (IP da VPS)." >&2
  exit 1
fi

mkdir -p "$LOCAL_DIR"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
TMP="$LOCAL_DIR/.tmp-$TS.dump"
FINAL="$LOCAL_DIR/olicmat-$TS.dump"

# 1) Dump custom-format (schema + dados). Se falhar, sai sem enviar nada.
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -Fc -d "$DB_NAME" > "$TMP"

# 2) Confere que não é vazio e promove a arquivo definitivo (atômico local).
[[ -s "$TMP" ]] || { echo "[$(date -u +%FT%TZ)] ERRO: dump vazio." >&2; rm -f "$TMP"; exit 1; }
mv "$TMP" "$FINAL"

# 3) Envia para a VPS: grava em .tmp e renomeia, para o lado remoto nunca
#    enxergar um arquivo pela metade.
ssh -q "${VPS_USER}@${VPS_HOST}" "mkdir -p $VPS_DIR"
scp -q "$FINAL" "${VPS_USER}@${VPS_HOST}:${VPS_DIR}/.tmp-${TS}.dump"
ssh -q "${VPS_USER}@${VPS_HOST}" "mv ${VPS_DIR}/.tmp-${TS}.dump ${VPS_DIR}/olicmat-${TS}.dump"

# 4) Rotação: mantém os KEEP mais recentes (local e remoto).
ls -1t "$LOCAL_DIR"/olicmat-*.dump 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f
ssh -q "${VPS_USER}@${VPS_HOST}" \
  "ls -1t $VPS_DIR/olicmat-*.dump 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f"

echo "[$(date -u +%FT%TZ)] backup ok → ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/olicmat-${TS}.dump"
