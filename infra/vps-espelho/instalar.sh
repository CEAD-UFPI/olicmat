#!/bin/sh
# Instala/atualiza o espelho da OLICMAT na VPS (rodar como root, de dentro desta pasta).
set -e
cd "$(dirname "$0")"
docker compose up -d --force-recreate
docker exec olicmat-espelho nginx -t
cp traefik-olicmat-espelho.yaml /etc/easypanel/traefik/config/olicmat-espelho.yaml
echo "Espelho no ar:"
echo "  Site:   https://olicmat.q7zbrj.easypanel.host"
echo "  Painel: https://painel-olicmat.q7zbrj.easypanel.host"
