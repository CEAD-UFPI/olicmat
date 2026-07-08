# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm ci --omit=dev && npm install --save-dev typescript @nestjs/cli

COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY start.sh ./

RUN npx prisma generate
RUN chmod +x start.sh

EXPOSE 3333
CMD ["./start.sh"]