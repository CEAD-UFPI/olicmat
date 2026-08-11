# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_EXAM_API_URL
ENV NEXT_PUBLIC_EXAM_API_URL=${NEXT_PUBLIC_EXAM_API_URL}

ARG NEXT_PUBLIC_DISABLE_EXAM_GUARD
ENV NEXT_PUBLIC_DISABLE_EXAM_GUARD=${NEXT_PUBLIC_DISABLE_EXAM_GUARD}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3003
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
