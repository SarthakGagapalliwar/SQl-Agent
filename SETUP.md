# Quick Setup Instructions

## ⚠️ IMPORTANT: Before Running Docker Commands

### 1. Start Docker Desktop

**Docker Desktop must be running before you can use Docker commands.**

- Open Docker Desktop application on Windows
- Wait for it to fully start (the whale icon in system tray should be stable)
- Verify it's running: `docker --version`

### 2. Configure Environment Variables

Edit the `.env` file and update these values:

```env
# Required: Get from https://console.mistral.ai/
MISTRAL_API_KEY=your_actual_mistral_api_key_here

# Optional: Change database password (recommended for production)
POSTGRES_PASSWORD=your_secure_password_here
```

**Never use the placeholder values in production!**

---

## 🚀 Quick Start Commands

After Docker Desktop is running and `.env` is configured:

```powershell
# Build the Docker images
docker compose build

# Start all services
docker compose up -d

# Run database migrations
docker compose exec app npx drizzle-kit migrate

# Seed database with sample data (optional)
docker compose exec app npx tsx src/app/db/db.seed.ts

# Check if services are running
docker compose ps

# View logs
docker compose logs -f app

# Access the application
# Open: http://localhost:3000
```

---

## 🔍 Troubleshooting

### Error: "The system cannot find the file specified" (dockerDesktopLinuxEngine)

**Solution:** Start Docker Desktop application

### Error: "variable is not set. Defaulting to a blank string"

**Solution:** Make sure `.env` file exists and contains all required variables

### Error: "Database connection failed"

**Solution:** Wait for PostgreSQL to be healthy, then run migrations:

```powershell
docker compose ps  # Check postgres is healthy
docker compose exec app npx drizzle-kit migrate
```

### Start fresh (reset everything)

```powershell
docker compose down -v
docker compose up -d --build
docker compose exec app npx drizzle-kit migrate
docker compose exec app npx tsx src/app/db/db.seed.ts
```

---

## 📊 Useful Commands

```powershell
# Stop services
docker compose stop

# Start stopped services
docker compose start

# Restart services
docker compose restart

# View real-time logs
docker compose logs -f

# Check service health
docker compose ps

# Execute commands in containers
docker compose exec app sh
docker compose exec postgres psql -U postgres -d sqlagent

# Remove everything (including volumes)
docker compose down -v
```

---

## ✅ Verification Checklist

- [ ] Docker Desktop is running
- [ ] `.env` file exists with valid `MISTRAL_API_KEY`
- [ ] `docker compose build` completed successfully
- [ ] `docker compose up -d` started services
- [ ] `docker compose ps` shows all services as "healthy"
- [ ] Migrations ran successfully
- [ ] http://localhost:3000 is accessible
- [ ] http://localhost:3000/api/health returns `{"status":"healthy"}`
