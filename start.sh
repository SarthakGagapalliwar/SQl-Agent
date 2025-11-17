#!/bin/bash
# SQL Agent Docker Quick Start Script

set -e

echo "🐳 SQL Agent Docker Setup"
echo "========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Copying from .env.docker..."
    cp .env.docker .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your MISTRAL_API_KEY before continuing!"
    echo ""
    read -p "Press Enter when you've updated .env with your API key..."
fi

# Validate MISTRAL_API_KEY
if grep -q "your_mistral_api_key_here" .env; then
    echo "❌ Error: Please set your MISTRAL_API_KEY in .env file"
    exit 1
fi

echo "📦 Building Docker images..."
docker compose build

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "🗄️  Running database migrations..."
docker compose exec app npx drizzle-kit migrate || echo "⚠️  Migration may have already run"

echo ""
read -p "Do you want to seed the database with sample data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    docker compose exec app npx tsx src/app/db/db.seed.ts
fi

echo ""
echo "✅ SQL Agent is ready!"
echo ""
echo "📍 Access points:"
echo "   - Application: http://localhost:3000"
echo "   - Health check: http://localhost:3000/api/health"
echo ""
echo "🛠️  Useful commands:"
echo "   - View logs: docker compose logs -f app"
echo "   - Stop: docker compose down"
echo "   - Restart: docker compose restart"
echo ""
