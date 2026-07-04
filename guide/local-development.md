# Local development

API and frontend on your machine with hot reload. PostgreSQL runs in Docker. Python uses the **`task-flow`** conda env.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Miniconda](https://www.anaconda.com/download/success) (Python 3.12)
- [Node.js](https://nodejs.org/) (LTS)

## Start

```bash
make dev
```

**Windows:** `.\scripts\dev-local.ps1`

### First run

1. Creates conda env `task-flow` from `environment.yml`
2. Installs backend and frontend dependencies
3. Copies `.env.example` → `.env` if missing

### Every run

1. Starts PostgreSQL (`db` container)
2. Runs Alembic migrations
3. Starts API with hot reload
4. Starts Next.js dev server

Press `Ctrl+C` to stop API and frontend. The database keeps running.

## URLs

| Service | URL |
| ------- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Database | `localhost:5432` |

Save a file and refresh — no rebuild needed.

## Commands

| Command | Description |
| ------- | ----------- |
| `make dev` | Setup (if needed), DB, migrate, API, frontend |
| `make dev-db` | PostgreSQL only |
| `make dev-migrate` | Apply migrations |
| `make dev-migrate-create MSG="..."` | New migration file |
| `make dev-backend` | API only |
| `make dev-frontend` | Frontend only |
| `make dev-test` | Run tests |
| `make dev-reset` | Wipe DB and re-migrate |
| `make down` | Stop Docker services |
