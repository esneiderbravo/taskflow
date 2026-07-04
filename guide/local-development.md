# Local development

API and frontend on your machine with hot reload. PostgreSQL runs in Docker. Python uses the **`task-flow`** conda env.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Miniconda](https://www.anaconda.com/download/success) (Python 3.12)
- [Node.js](https://nodejs.org/) (LTS)

## Start

**macOS / Linux**

```bash
make dev
```

**Windows (PowerShell)**

```powershell
.\scripts\dev-local.ps1
```

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

| Action | macOS / Linux | Windows (PowerShell) |
| ------ | ------------- | -------------------- |
| Start app | `make dev` | `.\scripts\dev-local.ps1` |
| PostgreSQL only | `make dev-db` | `docker compose up db -d` |
| Apply migrations | `make dev-migrate` | `cd backend; conda run -n task-flow alembic upgrade head` |
| New migration | `make dev-migrate-create MSG="..."` | `cd backend; conda run -n task-flow alembic revision --autogenerate -m "..."` |
| Run tests | `make dev-test` | See below |
| Reset database | `make dev-reset` | `docker compose down -v; docker compose up db -d` then migrate |
| Stop Docker | `make down` | `docker compose down` |

**Windows — run tests:**

```powershell
cd backend; conda run -n task-flow pytest -v
cd ..\frontend; npm test -- --run
```
