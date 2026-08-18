# syntax=docker/dockerfile:1
# ============================================================================
# OLICMAT — Módulo Provas — Frontend (Next.js 15, isolado)
#
# Build context: repo root  ->  docker build -f apps/exam/web/Dockerfile .
# ============================================================================

# ---- Build stage ----------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_EXAM_API_URL=/api
ENV NEXT_PUBLIC_EXAM_API_URL=${NEXT_PUBLIC_EXAM_API_URL}

ARG NEXT_PUBLIC_DISABLE_EXAM_GUARD
ENV NEXT_PUBLIC_DISABLE_EXAM_GUARD=${NEXT_PUBLIC_DISABLE_EXAM_GUARD}

ARG NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3001
ENV NEXT_PUBLIC_MAIN_APP_URL=${NEXT_PUBLIC_MAIN_APP_URL}

COPY apps/exam/web/package.json apps/exam/web/package-lock.json ./
RUN npm install

COPY apps/exam/web ./
RUN npm run build

# ---- Production stage -----------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Runtime env: resolved server-side by the API proxy (apps/exam/web/src/app/api/[...path]/route.ts)
ENV EXAM_API_URL=http://exam-api:3334/api

COPY --from=builder /app/package.json   ./package.json
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/.next          ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3003
CMD ["npm", "run", "start"]
