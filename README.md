# TaskFlow

Full-stack project and task manager for the **PyCon 2026** workshop. Next.js · FastAPI · PostgreSQL.

**Branch:** `workshop/sdd` — spec-driven development track

## Quick start

**Only requirement:** [Docker](https://docs.docker.com/get-docker/) running. The full stack (taskflow_db + backend + frontend) runs in containers — no conda, Node, or Python install needed. Details: [guide/docker.md](guide/docker.md).

**macOS / Linux**

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
git checkout workshop/sdd
make up
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

**Windows (PowerShell)**

```powershell
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
git checkout workshop/sdd
docker compose up --build -d
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

Open [http://localhost:3000](http://localhost:3000) · API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

After code changes: `make up` then `make logs` (rebuild is required — not hot reload).

## Guides

Detailed setup and workflows live in **[guide/](guide/README.md)**:

- [SDD walkthrough](guide/sdd-walkthrough.md) — clone to done (start here)
- [Docker](guide/docker.md) — run, rebuild, migrate, reset, switch branches
- [SDD workshop](guide/workshop.md) — tooling overview
- [User story (minimal)](guide/user-story-task-dependencies.md) — enrich with `/enrich-story`
