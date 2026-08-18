# syntax=docker/dockerfile:1
# ============================================================================
# OLICMAT — Módulo Cadastro/Configurações — Frontend (Next.js 16)
#
# Build context: repo root  ->  docker build -f apps/admin/web/Dockerfile .
# ============================================================================

# ---- Build stage ----------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY apps/admin/web/package.json apps/admin/web/package-lock.json ./
RUN npm ci

COPY apps/admin/web ./
RUN npm run build

# ---- Production stage -----------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json   ./package.json
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/.next          ./.next
COPY --from=builder /app/public         ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
