# syntax=docker/dockerfile:1
# ============================================================================
# OLICMAT — Módulo Provas — API (NestJS, isolada)
#
# Build context: repo root  ->  docker build -f apps/exam/api/Dockerfile .
# The @olicmat/shared package is built here and copied into the app's
# node_modules so the compiled backend resolves it at runtime.
# ============================================================================

# ---- Build stage ----------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# 1) Install backend dependencies (own lockfile)
COPY apps/exam/api/package.json apps/exam/api/package-lock.json ./apps/exam/api/
RUN cd apps/exam/api && npm ci

# 2) Build @olicmat/shared
COPY packages/shared ./packages/shared

RUN mkdir -p packages/shared/node_modules/@nestjs \
    && ln -sf /app/apps/exam/api/node_modules/@nestjs/common      packages/shared/node_modules/@nestjs/common \
    && ln -sf /app/apps/exam/api/node_modules/@nestjs/core        packages/shared/node_modules/@nestjs/core \
    && ln -sf /app/apps/exam/api/node_modules/@nestjs/passport    packages/shared/node_modules/@nestjs/passport

RUN cd packages/shared \
    && /app/apps/exam/api/node_modules/.bin/tsc -p tsconfig.json --incremental false

RUN mkdir -p apps/exam/api/node_modules/@olicmat/shared \
    && cp packages/shared/package.json apps/exam/api/node_modules/@olicmat/shared/package.json \
    && cp -r packages/shared/dist          apps/exam/api/node_modules/@olicmat/shared/dist

# 3) Build backend
COPY apps/exam/api ./apps/exam/api
WORKDIR /app/apps/exam/api

ARG DATABASE_URL=postgresql://build:build@localhost:5432/olicmat
ENV DATABASE_URL=$DATABASE_URL

# Prisma 7 'prisma-client-js' generator emits .js (not compiled by tsc) — the
# generated client must be copied into dist/ so runtime imports resolve.
RUN npx prisma generate
RUN npm run build
RUN mkdir -p dist/generated && cp -r generated/prisma dist/generated/prisma

# ---- Production stage -----------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/exam/api/node_modules   ./node_modules
COPY --from=builder /app/apps/exam/api/dist           ./dist
COPY --from=builder /app/apps/exam/api/package.json   ./package.json

EXPOSE 3334
CMD ["npm", "run", "start:prod"]
