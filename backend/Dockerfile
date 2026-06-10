# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm install --save-dev typescript @nestjs/cli

COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

RUN npx prisma generate

EXPOSE 3333
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
