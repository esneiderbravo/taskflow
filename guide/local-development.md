# Local development

API and frontend run on your machine with hot reload. **PostgreSQL must run in Docker** — local development does not start a database outside Docker. Python must use a **pre-created conda environment** named **`task-flow`**.

## Prerequisites

Install these before the first `npm run dev` / `.\scripts\dev-local.ps1`:

| Requirement | Why |
| ----------- | --- |
| [Docker](https://docs.docker.com/get-docker/) (running) | **Required for the database.** Local mode only starts the `db` service via `docker compose`. Without Docker, migrations and the API cannot connect to PostgreSQL. |
| Conda env **`task-flow`** already created | **Required for the backend.** Create it once from `environment.yml` before starting the app. Do not rely on first-run setup for this. |
| [Node.js](https://nodejs.org/) (LTS) | Frontend (`npm` / Next.js) |
| [Miniconda](https://www.anaconda.com/download/success) (Python 3.12) | Only needed to create and use the `task-flow` env |

### Create the conda environment (once)

```bash
conda env create -f environment.yml
conda activate task-flow
```

Confirm it exists:

```bash
conda env list
```

You should see `task-flow` in the list before continuing.

### Confirm Docker is available

```bash
docker info
```

Docker Desktop (or another Docker engine) must be running. Local development uses it **only for PostgreSQL** (`docker compose up db`), not for the API or frontend containers.

## Start

**macOS / Linux**

```bash
npm run dev
```

**Windows (PowerShell)**

```powershell
.\scripts\dev-local.ps1
```

### First run (after prerequisites)

1. Installs backend and frontend dependencies (if needed)
2. Copies `.env.example` → `.env` if missing
3. Starts PostgreSQL in Docker (`db` container)
4. Runs Alembic migrations
5. Starts API and Next.js with hot reload

### Every run

1. Starts PostgreSQL (`db` container) if it is not already up
2. Runs Alembic migrations
3. Starts API with hot reload
4. Starts Next.js dev server

Press `Ctrl+C` to stop API and frontend. The database container keeps running until you stop it.

## URLs

| Service | URL |
| ------- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Database | `localhost:5432` (Docker `db` service) |

Save a file and refresh — no rebuild needed.

## Commands

| Action | macOS / Linux | Windows (PowerShell) |
| ------ | ------------- | -------------------- |
| Start app | `npm run dev` | `.\scripts\dev-local.ps1` |
| PostgreSQL only (Docker) | `npm run dev:db` | `docker compose up db -d` |
| Apply migrations | `npm run migrate` | `cd backend; conda run -n task-flow alembic upgrade head` |
| New migration | `MSG="..." npm run dev:migrate:create` | `cd backend; conda run -n task-flow alembic revision --autogenerate -m "..."` |
| Run tests | `npm test` | See below |
| Reset database | `npm run dev:reset` | `docker compose down -v; docker compose up db -d` then migrate |
| Stop Docker services | `npm run docker:down` | `docker compose down` |

**Windows — run tests:**

```powershell
cd backend; conda run -n task-flow pytest -v
cd ..\frontend; npm test -- --run
```

## Troubleshooting

| Symptom | Likely cause |
| ------- | ------------ |
| `Cannot connect to Docker` / `db` fails to start | Docker is not installed or not running |
| `conda: environment not found` / backend fails | Create `task-flow` with `conda env create -f environment.yml` |
| Migrations hang or fail | PostgreSQL container is not healthy — run `npm run dev:db` and wait for `pg_isready` |
