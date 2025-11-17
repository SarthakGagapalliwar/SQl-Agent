# SQL Agent - Docker Deployment Guide

## 🐳 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Mistral AI API key ([Get one here](https://console.mistral.ai/))

### Steps

1. **Configure environment variables:**

   ```bash
   cp .env.docker .env
   ```

   Edit `.env` and add your `MISTRAL_API_KEY` and set a secure `POSTGRES_PASSWORD`.

2. **Build and start services:**

   ```bash
   docker-compose up -d
   ```

3. **Run database migrations:**

   ```bash
   docker-compose exec app sh -c "npx drizzle-kit migrate"
   ```

4. **Seed the database (optional):**

   ```bash
   docker-compose exec app sh -c "npx tsx src/app/db/db.seed.ts"
   ```

5. **Access the application:**
   - App: http://localhost:3000
   - Database Admin (Adminer): http://localhost:8080 (use `docker-compose --profile tools up -d` to enable)

## 🛠️ Docker Commands

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f app
docker-compose logs -f postgres
```

### Rebuild after code changes

```bash
docker-compose up -d --build
```

### Run migrations

```bash
docker-compose exec app npx drizzle-kit migrate
```

### Access database shell

```bash
docker-compose exec postgres psql -U postgres -d sqlagent
```

### Check health status

```bash
curl http://localhost:3000/api/health
```

## 🗄️ Database Management

### Using Adminer UI

Start with database tools profile:

```bash
docker-compose --profile tools up -d
```

Access Adminer at http://localhost:8080

- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: (from your .env)
- Database: sqlagent

### Backup database

```bash
docker-compose exec postgres pg_dump -U postgres sqlagent > backup.sql
```

### Restore database

```bash
docker-compose exec -T postgres psql -U postgres sqlagent < backup.sql
```

## 🔧 Troubleshooting

### View container status

```bash
docker-compose ps
```

### Check container health

```bash
docker inspect --format='{{json .State.Health}}' sql-agent-app
```

### Reset everything

```bash
docker-compose down -v
docker-compose up -d --build
```

## 📦 Production Deployment

For production:

1. Use secrets management for sensitive variables
2. Set strong `POSTGRES_PASSWORD`
3. Configure proper SSL certificates
4. Set up reverse proxy (nginx/traefik)
5. Enable backups with volume snapshots
6. Use external managed database if preferred

### External Database

To use external PostgreSQL (like Neon), modify `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      DATABASE_URL: ${DATABASE_URL} # Point to external DB
    # Remove depends_on: postgres
```

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │ :3000
│   (sql-agent)   │
└────────┬────────┘
         │
         ├─────────────┐
         │             │
    ┌────▼────┐   ┌────▼─────┐
    │ Postgres│   │ Mistral  │
    │   :5432 │   │   API    │
    └─────────┘   └──────────┘
         │
    ┌────▼────┐
    │ Volume  │
    │  Data   │
    └─────────┘
```

## 📊 Resource Requirements

Minimum:

- CPU: 2 cores
- RAM: 2GB
- Disk: 10GB

Recommended:

- CPU: 4 cores
- RAM: 4GB
- Disk: 20GB
