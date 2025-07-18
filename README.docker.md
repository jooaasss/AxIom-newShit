# Docker Setup Guide

This project now supports Docker for consistent development and production environments.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Development with Docker

1. **Copy environment variables:**
   ```bash
   cp .env.docker .env.local
   ```
   Edit `.env.local` with your actual API keys and configuration.

2. **Start development environment:**
   ```bash
   npm run docker:dev
   ```
   This will:
   - Build the Docker image
   - Start PostgreSQL database
   - Run Prisma migrations
   - Start the Next.js development server with hot reload
   - Start Adminer (database UI) on port 8080

3. **Access the application:**
   - App: http://localhost:3000
   - Database UI (Adminer): http://localhost:8080
     - Server: `db`
     - Username: `postgres`
     - Password: `password`
     - Database: `try1_db`

### Production Deployment

1. **Build and start production containers:**
   ```bash
   npm run docker:up
   ```

2. **View logs:**
   ```bash
   npm run docker:logs
   ```

3. **Stop containers:**
   ```bash
   npm run docker:down
   ```

## Available Docker Scripts

- `npm run docker:build` - Build the Docker image
- `npm run docker:dev` - Start development environment with hot reload
- `npm run docker:up` - Start production containers in detached mode
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View container logs
- `npm run docker:clean` - Stop containers and remove volumes

## Docker Architecture

### Services

1. **app** - Next.js application
   - Port: 3000
   - Hot reload enabled in development
   - Includes Prisma client generation

2. **db** - PostgreSQL database
   - Port: 5432
   - Persistent data storage
   - Auto-initialization

3. **adminer** - Database management UI
   - Port: 8080
   - Web-based PostgreSQL admin interface

### Volumes

- `postgres_data` - Persistent PostgreSQL data
- Source code mounted for development hot reload

## Environment Variables

The Docker setup uses the same environment variables as the local development setup. Key variables for Docker:

- `DATABASE_URL` - Automatically configured for Docker PostgreSQL
- All API keys and secrets from your `.env.local`

## Troubleshooting

### Port Conflicts
If ports 3000, 5432, or 8080 are already in use:
1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`

### Database Issues
```bash
# Reset database and volumes
npm run docker:clean
npm run docker:dev
```

### Container Rebuild
```bash
# Force rebuild containers
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

### View Container Status
```bash
docker-compose ps
```

## Production Considerations

- Use proper secrets management
- Configure SSL/TLS certificates
- Set up proper backup strategies for PostgreSQL
- Use environment-specific docker-compose files
- Consider using Docker Swarm or Kubernetes for scaling

## Benefits of Docker Setup

✅ **Consistent Environment** - Same setup across development, staging, and production
✅ **Easy Onboarding** - New developers can start with one command
✅ **Database Included** - No need to install PostgreSQL locally
✅ **Isolated Dependencies** - No conflicts with system packages
✅ **Production Ready** - Optimized multi-stage builds
✅ **Scalable** - Easy to add more services (Redis, etc.)