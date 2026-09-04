#!/bin/sh

echo "========================================="
echo "🚀 OLICMAT Backend Starting..."
echo "========================================="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Step 1: Run migrations
echo "📦 Step 1: Running Prisma migrations..."
npx prisma migrate deploy 2>&1
MIGRATION_EXIT=$?
echo "Migration exit code: $MIGRATION_EXIT"

# Uma migration que falha deixa o banco fora de sincronia com o código. Subir
# o servidor assim faz o container parecer saudável no orquestrador enquanto
# toda rota que toca o banco falha — um modo de falha silencioso e caro de
# diagnosticar. Melhor parar aqui, com o erro visível.
if [ "$MIGRATION_EXIT" -ne 0 ]; then
  echo ""
  echo "========================================="
  echo "❌ ABORTANDO: as migrations falharam."
  echo ""
  echo "   O servidor NÃO será iniciado: o banco está fora de sincronia"
  echo "   com o código. Verifique DATABASE_URL (host, porta, credenciais"
  echo "   e escape de caracteres especiais na senha) e a conectividade"
  echo "   com o PostgreSQL. Corrija e reinicie o container."
  echo "========================================="
  exit "$MIGRATION_EXIT"
fi

# Step 2: Run seed
echo ""
echo "🌱 Step 2: Running database seed..."
npx prisma db seed 2>&1
SEED_EXIT=$?
echo "Seed exit code: $SEED_EXIT"

# O seed não é fatal: é idempotente e a aplicação sobe sem ele. Mas o aviso
# precisa ficar visível, porque dados de referência ausentes (instituições,
# cursos) aparecem depois como listas vazias na interface.
if [ "$SEED_EXIT" -ne 0 ]; then
  echo ""
  echo "⚠️  AVISO: o seed falhou. O servidor vai subir mesmo assim, mas os"
  echo "   dados de referência podem estar incompletos."
fi

echo ""
echo "========================================="
echo "🚀 Starting NestJS server..."
echo "========================================="
exec node dist/src/main.js
