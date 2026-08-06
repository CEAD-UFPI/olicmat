# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the local prisma schema
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma Client
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate --schema=./prisma/schema.prisma

# Copy application source
COPY . .

# Copy the generated client to both /backend/generated/prisma (for tsc at compile time)
# and /app/backend/generated/prisma (for node at run time).
RUN mkdir -p /backend/generated && cp -r /app/generated/prisma /backend/generated/prisma
RUN mkdir -p /app/backend/generated && cp -r /app/generated/prisma /app/backend/generated/prisma

# Build the NestJS application
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copy the generated client that is at /app/backend/generated
COPY --from=builder /app/backend/generated ./backend/generated

EXPOSE 3334
CMD ["npm", "run", "start:prod"]
