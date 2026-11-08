#!/usr/bin/env bash
#
# rsync-uploads-para-vps.sh — espelha o volume de uploads (Máquina 1) para a VPS.
#
# Roda na Máquina 1. Uploads são comprovantes de inscrição e envios da Fase 2;
# a Fase 1 de amanhã NÃO gera upload, então isto é baixa prioridade hoje.
#
# Pré-requisitos:
#   1. Chave SSH da Máquina 1 autorizada na VPS.
#   2. Descobrir o caminho do volume no host da Máquina 1:
#        docker volume inspect olicmat-prod_uploads --format '{{.Mountpoint}}'
#      e ajustar SRC abaixo (se for bind mount, use o caminho direto).
#
# Cron sugerido (crontab -e na Máquina 1):
#   */10 * * * * /opt/olicmat/infra/redundancia/rsync-uploads-para-vps.sh >> /var/log/olicmat-uploads.log 2>&1
# ============================================================================

set -euo pipefail

VPS_HOST="${VPS_HOST:-}"                       # IP público da VPS (obrigatório)
VPS_USER="${VPS_USER:-root}"
VPS_UPLOADS="${VPS_UPLOADS:-/opt/olicmat/uploads}"   # alvo na VPS (bind mount)
SRC="${SRC:-/var/lib/docker/volumes/olicmat-prod_uploads/_data}"

if [[ -z "$VPS_HOST" ]]; then
  echo "[$(date -u +%FT%TZ)] ERRO: defina VPS_HOST (IP da VPS)." >&2
  exit 1
fi

ssh -q "${VPS_USER}@${VPS_HOST}" "mkdir -p $VPS_UPLOADS"
rsync -az --delete -e ssh "$SRC/" "${VPS_USER}@${VPS_HOST}:${VPS_UPLOADS}/"
echo "[$(date -u +%FT%TZ)] uploads ok → ${VPS_USER}@${VPS_HOST}:${VPS_UPLOADS}/"
