#!/bin/sh

echo "========================================="
echo "🚀 OLICMAT Backend Starting..."
echo "========================================="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Step 1: Run migrations
echo "📦 Step 1: Running Prisma migrations..."
npx prisma migrate deploy 2>&1
echo "Migration exit code: $?"

# Step 2: Run seed
echo ""
echo "🌱 Step 2: Running database seed..."
npx prisma db seed 2>&1
echo "Seed exit code: $?"

echo ""
echo "========================================="
echo "🚀 Starting NestJS server..."
echo "========================================="
exec node dist/src/main.js
