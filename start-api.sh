#!/bin/bash

echo "🔧 Setting up environment for API startup..."

# Set development environment explicitly
export NODE_ENV=development
export PORT=3000

# Database configuration for local development
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=phish
export DB_PASSWORD=""
export DB_NAME=founders_codex

echo "📊 Environment variables set:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DB_HOST: $DB_HOST"
echo "DB_USERNAME: $DB_USERNAME"
echo "DB_NAME: $DB_NAME"

echo ""
echo "🧪 Testing database connection..."
if psql -U $DB_USERNAME -h $DB_HOST -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "Please ensure PostgreSQL is running and the database exists."
    exit 1
fi

echo ""
echo "🚀 Starting API server..."
cd "$(dirname "$0")"
npx ts-node api/src/main.ts 