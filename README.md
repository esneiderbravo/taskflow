# TaskFlow

Full-stack project and task manager for the **PyCon 2026** workshop. Next.js · FastAPI · PostgreSQL.

**Branch:** `workshop/sdd` — spec-driven development track

## Quick start

**Before the first run:** Docker must be running (PostgreSQL only), and the conda env `task-flow` must already exist (`conda env create -f environment.yml`). Details: [guide/local-development.md](guide/local-development.md).

**macOS / Linux**

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
git checkout workshop/sdd
make dev
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

**Windows (PowerShell)**

```powershell
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
git checkout workshop/sdd
.\scripts\dev-local.ps1
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

Open [http://localhost:3000](http://localhost:3000) · API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

## Guides

Detailed setup and workflows live in **[guide/](guide/README.md)**:

- [SDD walkthrough](guide/sdd-walkthrough.md) — clone to done (start here)
- [Local development](guide/local-development.md) — hot reload (Docker for DB + ready `task-flow` conda env)
- [Docker](guide/docker.md) — full stack in containers
- [SDD workshop](guide/workshop.md) — tooling overview
- [User story (minimal)](guide/user-story-task-dependencies.md) — enrich with `/enrich-story`
