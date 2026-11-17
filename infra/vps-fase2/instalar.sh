#!/usr/bin/env bash
# Instala (ou atualiza) a nuvem da Fase 2 e o compressor na VPS.
# Uso: sudo ./instalar.sh   (na pasta infra/vps-fase2, copiada para /opt/olicmat-fase2)
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  KEY="olicmat$(openssl rand -hex 6)"
  SECRET="$(openssl rand -base64 48 | tr -d '/+=' | cut -c1-48)"
  TOKEN="$(openssl rand -base64 48 | tr -d '/+=' | cut -c1-48)"
  sed -e "s|^FASE2_COMPRESSOR_TOKEN=.*|FASE2_COMPRESSOR_TOKEN=$TOKEN|" \
      -e "s|^S3_ACCESS_KEY=.*|S3_ACCESS_KEY=$KEY|" \
      -e "s|^S3_SECRET_KEY=.*|S3_SECRET_KEY=$SECRET|" .env.exemplo > .env
  chmod 600 .env
  echo "Chaves novas geradas em .env"
fi
set -a; . ./.env; set +a

cat > s3.json <<JSON
{"identities":[{"name":"olicmat","credentials":[{"accessKey":"$S3_ACCESS_KEY","secretKey":"$S3_SECRET_KEY"}],"actions":["Admin","Read","Write","List","Tagging"]}]}
JSON
chmod 644 s3.json

docker compose up -d --build
for i in $(seq 1 30); do
  docker exec olicmat-nuvem sh -c 'echo "s3.bucket.list" | weed shell' >/dev/null 2>&1 && break; sleep 2
done
docker exec olicmat-nuvem sh -c "echo 's3.bucket.list' | weed shell" | grep -q "$S3_BUCKET" \
  || docker exec olicmat-nuvem sh -c "echo 's3.bucket.create -name $S3_BUCKET' | weed shell"

cp traefik-olicmat-fase2.yaml /etc/easypanel/traefik/config/olicmat-fase2.yaml
echo "Pronto. Nuvem em https://arquivos-olicmat.q7zbrj.easypanel.host"
