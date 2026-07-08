#!/bin/sh
set -e

echo "🚀 Starting OLICMAT Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until npx prisma db push --skip-generate 2>/dev/null; do
  echo "   Database not ready, waiting..."
  sleep 2
done
echo "✅ Database is ready"

# Run migrations
echo "📦 Running migrations..."
npx prisma migrate deploy
echo "✅ Migrations applied"

# Run seed (uses upsert, safe to run multiple times)
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️  Seed completed with warnings (data may already exist)"
echo "✅ Database seeded"

# Start the server
echo "🚀 Starting NestJS server..."
exec node dist/src/main.js
