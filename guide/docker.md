# Docker

Entire stack in containers. No Python, Node.js, or conda on your machine.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

## Start

**macOS / Linux**

```bash
make up
```

**Windows (PowerShell)**

```powershell
docker compose up --build -d
```

First build ~90s. You should see three containers: `db`, `backend`, `frontend`.

## URLs

| Service | URL |
| ------- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Health | [http://localhost:8000/health](http://localhost:8000/health) |

## Seeing changes

Edits are **not** live. After saving code:

**macOS / Linux**

```bash
make up
make logs   # wait for "Application startup complete"
```

**Windows (PowerShell)**

```powershell
docker compose up --build -d
docker compose logs -f
```

## Commands

| Action | macOS / Linux | Windows (PowerShell) |
| ------ | ------------- | -------------------- |
| Start | `make up` | `docker compose up --build -d` |
| Stop | `make down` | `docker compose down` |
| Logs | `make logs` | `docker compose logs -f` |
| Migrate | `make migrate` | `docker compose exec backend alembic upgrade head` |
| New migration | `make migrate-create MSG="..."` | `docker compose run --rm backend alembic revision --autogenerate -m "..."` |
| Reset DB | `make reset` | `docker compose down -v; docker compose up --build -d` |
| Tests | `make test` | `docker compose exec backend pytest -v` then frontend tests |

Migrations live in `backend/alembic/versions/`.
