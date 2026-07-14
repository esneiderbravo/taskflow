# Docker (only supported way to run TaskFlow)

The **entire stack** runs in containers: `db`, `backend`, and `frontend`.

No Python, Node.js, conda, or OS-specific app setup on your machine — only [Docker](https://docs.docker.com/get-docker/).

Windows participants use the same Docker Compose commands (PowerShell). macOS/Linux can use `make` shortcuts.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and **running** (`docker info`)

## Start

**macOS / Linux**

```bash
make up
```

**Windows (PowerShell)**

```powershell
docker compose up --build -d
```

First build ~90s. Expect three containers: `db`, `backend`, `frontend`.

## URLs

| Service | URL |
| ------- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Health | [http://localhost:8000/health](http://localhost:8000/health) |

## Seeing code changes (important for the workshop)

Edits on your machine are **not** live inside containers. After the agent (or you) change code:

**macOS / Linux**

```bash
make up
make logs
```

**Windows (PowerShell)**

```powershell
docker compose up --build -d
docker compose logs -f
```

Wait until logs show something like `Application startup complete` (backend) and the frontend is ready, then refresh the browser.

### Schema / migration changes

```bash
make migrate-create MSG="describe your change"   # macOS/Linux
make migrate
make up
make test
```

**Windows:**

```powershell
docker compose run --rm `
  -v "${PWD}/backend/app:/app/app" `
  -v "${PWD}/backend/alembic:/app/alembic" `
  backend alembic revision --autogenerate -m "describe your change"
docker compose exec backend alembic upgrade head
docker compose up --build -d
docker compose exec backend pytest -v
docker compose exec frontend npm test -- --run
```

## Switching branches (reset every time)

Branches differ in code and seed data. Always restart clean:

**macOS / Linux**

```bash
make down
git checkout <branch>    # main | workshop/vibe-coding | workshop/sdd
make reset               # wipe DB volumes + rebuild stack
```

**Windows (PowerShell)**

```powershell
docker compose down
git checkout <branch>
docker compose down -v
docker compose up --build -d
```

Do **not** leave an old stack running on ports 3000/8000 when switching.

## Commands

| Action | macOS / Linux | Windows (PowerShell) |
| ------ | ------------- | -------------------- |
| Start / rebuild | `make up` | `docker compose up --build -d` |
| Stop | `make down` | `docker compose down` |
| Logs | `make logs` | `docker compose logs -f` |
| Apply migrations | `make migrate` | `docker compose exec backend alembic upgrade head` |
| New migration | `make migrate-create MSG="..."` | see above |
| Reset DB + stack | `make reset` | `docker compose down -v; docker compose up --build -d` |
| Tests | `make test` | `docker compose exec backend pytest -v` then frontend tests |

Migrations live in `backend/alembic/versions/`.

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Port 3000/8000 in use | `make down` / `docker compose down`, then `make up` |
| Cannot connect to Docker | Start Docker Desktop; run `docker info` |
| Empty or weird data after checkout | You skipped reset → `make reset` |
| Code changes not visible | Rebuild: `make up` and wait in `make logs` |
