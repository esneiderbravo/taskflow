# TaskFlow

Lightweight project and task management app for the **PyCon 2026** workshop: *Beyond Vibe Coding — Spec-Driven Development with Code Graphs*.

## Quick Start

Requirements: [Docker](https://docs.docker.com/get-docker/) and [Git](https://git-scm.com/).

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API docs | http://localhost:8000/docs |
| Health   | http://localhost:8000/health |

Startup takes ~90 seconds on first build. Subsequent runs are under 30 seconds.

## Make Commands

```bash
make up      # Start services in background
make down    # Stop services
make test    # Run backend + frontend tests
make seed    # Re-seed demo data
make reset   # Wipe database and restart
make logs    # Tail container logs
```

## Demo Data

On first start, the database is seeded with:

- **Web App Launch** — Setup Database (done), Implement API (in progress), Build Frontend, Deploy
- **API Migration** — Audit endpoints (done), Write migration plan (in progress)

## Project Structure

```
├── backend/          FastAPI + SQLModel + SQLite
│   ├── app/
│   │   ├── api/      REST routes
│   │   ├── models/   Project, Task
│   │   ├── repositories/
│   │   ├── services/
│   │   └── tests/
│   └── scripts/      seed.py
├── frontend/         Next.js + React + TypeScript + Tailwind
│   ├── app/          Dashboard + Project Detail
│   ├── components/
│   ├── hooks/
│   └── tests/
└── docs/             Workshop prompts and guides
```

## Architecture

Layered backend following repository → service → API pattern:

```
HTTP Request → routes.py → Service → Repository → SQLModel → SQLite
```

Frontend communicates with the backend via a typed API client in `frontend/lib/api.ts`.

## Workshop Branches

| Branch | Purpose |
|--------|---------|
| `main` | Base app (this branch) — no task dependencies feature |
| `workshop/bare` | Vibe coding demo — no OpenSpec, no CodeGraph |
| `workshop/sdd` | Spec-driven demo — OpenSpec pre-configured on this branch only |

### Workshop Tool Setup (Part 2 only — branch `workshop/sdd`)

OpenSpec and CodeGraph are **not** on `main`. See **[docs/WORKSHOP.md](docs/WORKSHOP.md)** for manual installation steps on the `workshop/sdd` branch.

See [docs/PROMPT.md](docs/PROMPT.md) for the canonical workshop prompt.

## Running Tests Locally

**Backend** (requires Python 3.12+):

```bash
cd backend
pip install -e ".[dev]"
pytest -v
```

**Frontend** (requires Node.js 22+):

```bash
cd frontend
npm install
npm test -- --run
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Vitest |
| Backend | FastAPI, Python 3.12, SQLModel, Pytest |
| Database | SQLite |
| DevOps | Docker Compose |

## License

MIT
