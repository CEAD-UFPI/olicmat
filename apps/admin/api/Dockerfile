# syntax=docker/dockerfile:1
# ============================================================================
# OLICMAT — Módulo Cadastro/Configurações — API (NestJS)
#
# Build context: repo root  ->  docker build -f apps/admin/api/Dockerfile .
# The @olicmat/shared package is built here and copied into the app's
# node_modules so the compiled backend resolves it at runtime.
# ============================================================================

# ---- Build stage ----------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# 1) Install backend dependencies (own lockfile)
COPY apps/admin/api/package.json apps/admin/api/package-lock.json ./apps/admin/api/
RUN cd apps/admin/api && npm ci

# 2) Build @olicmat/shared
COPY packages/shared ./packages/shared

# shared imports @nestjs/* — link them from the backend node_modules so tsc
# resolves the types while compiling packages/shared.
RUN mkdir -p packages/shared/node_modules/@nestjs \
    && ln -sf /app/apps/admin/api/node_modules/@nestjs/common      packages/shared/node_modules/@nestjs/common \
    && ln -sf /app/apps/admin/api/node_modules/@nestjs/core        packages/shared/node_modules/@nestjs/core \
    && ln -sf /app/apps/admin/api/node_modules/@nestjs/passport    packages/shared/node_modules/@nestjs/passport

RUN cd packages/shared \
    && /app/apps/admin/api/node_modules/.bin/tsc -p tsconfig.json --incremental false

# Install shared into the backend node_modules as a real (copied) package —
# a copy (not a symlink) resolves @nestjs deps from the app's flat node_modules.
RUN mkdir -p apps/admin/api/node_modules/@olicmat/shared \
    && cp packages/shared/package.json apps/admin/api/node_modules/@olicmat/shared/package.json \
    && cp -r packages/shared/dist          apps/admin/api/node_modules/@olicmat/shared/dist

# 3) Build backend
COPY apps/admin/api ./apps/admin/api
WORKDIR /app/apps/admin/api

ARG DATABASE_URL=postgresql://build:build@localhost:5432/olicmat
ENV DATABASE_URL=$DATABASE_URL

# Prisma 7 'prisma-client' generator emits .ts files, compiled into dist/ by tsc
RUN npx prisma generate
RUN npm run build

# ---- Production stage -----------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/admin/api/node_modules   ./node_modules
COPY --from=builder /app/apps/admin/api/dist           ./dist
COPY --from=builder /app/apps/admin/api/package.json   ./package.json
COPY --from=builder /app/apps/admin/api/prisma         ./prisma
COPY --from=builder /app/apps/admin/api/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/apps/admin/api/start.sh       ./start.sh

RUN chmod +x start.sh

EXPOSE 3333
CMD ["./start.sh"]
