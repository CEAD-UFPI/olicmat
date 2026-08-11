# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_EXAM_API_URL=/api
ENV NEXT_PUBLIC_EXAM_API_URL=${NEXT_PUBLIC_EXAM_API_URL}

ARG NEXT_PUBLIC_DISABLE_EXAM_GUARD
ENV NEXT_PUBLIC_DISABLE_EXAM_GUARD=${NEXT_PUBLIC_DISABLE_EXAM_GUARD}

ARG NEXT_PUBLIC_MAIN_APP_URL=https://olicmat.cead.ufpi.br
ENV NEXT_PUBLIC_MAIN_APP_URL=${NEXT_PUBLIC_MAIN_APP_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Runtime env: backend URL resolved server-side by the API proxy
ENV EXAM_API_URL=http://olicmat-exam-api:3334/api

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./

EXPOSE 3003
CMD ["npm", "run", "start"]
