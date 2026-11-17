FROM node:22-bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY s3.mjs compressor.mjs ./
# Pasta de trabalho do usuário node (o volume herda a permissão ao ser criado).
RUN mkdir -p /trabalho && chown node:node /trabalho
USER node
CMD ["node", "compressor.mjs"]
