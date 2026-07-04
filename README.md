# TaskFlow

A lightweight, full-stack project and task management application built for the **PyCon 2026** workshop — *Beyond Vibe Coding: Spec-Driven Development with Code Graphs*.

TaskFlow provides a practical sandbox to explore modern development workflows: manage projects and tasks through a clean web UI, interact with a REST API, and iterate on features in a containerized environment. The entire stack runs with a single command — no local runtime setup required.

**Stack:** Next.js · FastAPI · PostgreSQL · Docker

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)



## 🚀 Getting Started

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
make up
```

The first build takes about 90 seconds. Subsequent starts are under 30 seconds.

In Docker Desktop, you should see three running containers under the **taskflow** stack: `db`, `frontend`, and `backend`.

![Docker containers after make up](docs/docker_containers.png)

| Service      | URL                                                      |
| ------------ | -------------------------------------------------------- |
| 🖥️ Frontend | [http://localhost:3000](http://localhost:3000)           |
| 📖 API docs  | [http://localhost:8000/docs](http://localhost:8000/docs) |


Verify the backend is healthy:

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

Stop the application:

```bash
make down
```

Follow container logs:

```bash
make logs
```



## 🔄 Seeing Your Changes

The app runs entirely inside Docker with production builds. Edits are **not** picked up automatically — follow these steps after modifying files.

### 1. Save your changes

Edit any file under `frontend/` or `backend/`.

### 2. Rebuild and restart the stack

```bash
make up
```

Equivalent without `make` (e.g. Windows):

```bash
docker compose up --build -d
```



### 3. Wait for the backend to be healthy

Migrations run on backend startup. Check progress:

```bash
make logs
```

Look for `Running database migrations...` and `Application startup complete`.

### 4. Refresh the browser

Open or reload [http://localhost:3000](http://localhost:3000) to see frontend changes.

For API-only changes, use [http://localhost:8000/docs](http://localhost:8000/docs) or:

```bash
curl http://localhost:8000/health
```



### If you changed database models

Create and apply a new migration before rebuilding:

```bash
docker compose exec backend alembic revision --autogenerate -m "describe your change"
make migrate
make up
```

To wipe the database and start fresh (schema + demo seed):

```bash
make reset
```

