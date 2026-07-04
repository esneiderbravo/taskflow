# TaskFlow

Full-stack project and task manager for the **PyCon 2026** workshop. Next.js · FastAPI · PostgreSQL.

**Branch:** `workshop/sdd` — spec-driven development track

## Quick start

**macOS / Linux**

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
git checkout workshop/sdd
make dev
npm install -g @fission-ai/openspec@latest
openspec init
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
openspec init
npm install -g @colbymchenry/codegraph
codegraph init
```

Open [http://localhost:3000](http://localhost:3000) · API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

## Guides

Detailed setup and workflows live in **[guide/](guide/README.md)**:

- [Local development](guide/local-development.md) — hot reload (`make dev`)
- [Docker](guide/docker.md) — full stack (`make up`)
- [SDD workshop](guide/workshop.md) — OpenSpec workflow
- [User story](guide/user-story-task-dependencies.md) — full feature spec
