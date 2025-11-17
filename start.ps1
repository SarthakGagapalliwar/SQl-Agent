# SQL Agent Docker Quick Start Script for Windows

Write-Host "🐳 SQL Agent Docker Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  No .env file found. Copying from .env.docker..." -ForegroundColor Yellow
    Copy-Item .env.docker .env
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env and add your MISTRAL_API_KEY before continuing!" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter when you've updated .env with your API key"
}

# Validate MISTRAL_API_KEY
$envContent = Get-Content .env -Raw
if ($envContent -match "your_mistral_api_key_here") {
    Write-Host "❌ Error: Please set your MISTRAL_API_KEY in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building Docker images..." -ForegroundColor Cyan
docker compose build

Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Cyan
docker compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
docker compose exec app npx drizzle-kit migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Migration may have already run" -ForegroundColor Yellow
}

Write-Host ""
$seed = Read-Host "Do you want to seed the database with sample data? (y/N)"
if ($seed -eq 'y' -or $seed -eq 'Y') {
    Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
    docker compose exec app npx tsx src/app/db/db.seed.ts
}

Write-Host ""
Write-Host "✅ SQL Agent is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access points:" -ForegroundColor Cyan
Write-Host "   - Application: http://localhost:3000"
Write-Host "   - Health check: http://localhost:3000/api/health"
Write-Host ""
Write-Host "🛠️  Useful commands:" -ForegroundColor Cyan
Write-Host "   - View logs: docker compose logs -f app"
Write-Host "   - Stop: docker compose down"
Write-Host "   - Restart: docker compose restart"
Write-Host ""
