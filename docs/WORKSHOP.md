# Workshop Guide — TaskFlow

**PyCon 2026 · Beyond Vibe Coding — Spec-Driven Development with Code Graphs**

This guide covers environment setup, what to install before vs. during the workshop, and the step-by-step flow for facilitators and participants.

---

## Executive Summary

| Tool | In the repo? | In-person install? | Estimated time |
|------|--------------|----------------------|----------------|
| **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — spec-driven development | Config yes (`openspec/`, `.cursor/`) | Global CLI (`npm`) | ~2 min |
| **[CodeGraph](https://github.com/colbymchenry/codegraph)** — local code graph | No (`.codegraph/` is local) | CLI + MCP in Cursor | ~3 min |
| **TaskFlow app** | Yes (full codebase) | Docker Compose | ~90 s (first build) |

**Recommendation:** use a **hybrid** approach.

- **Pre-configure in the repo** (`workshop/sdd` branch only): OpenSpec (`openspec/config.yaml`, `/opsx:*` commands in `.cursor/`). The `main` branch does **not** include OpenSpec or CodeGraph.
- **Install in person** (or before the event): global OpenSpec and CodeGraph CLIs, plus `codegraph install` to wire up Cursor MCP.
- **Index on each machine**: `codegraph init` takes under 1 second on TaskFlow — not worth committing the index.

---

## Prerequisites

### Required (all participants)

| Tool | Version | Verify |
|------|---------|--------|
| [Docker Desktop](https://docs.docker.com/get-docker/) | Recent | `docker compose version` |
| [Git](https://git-scm.com/) | 2.x | `git --version` |
| [Node.js](https://nodejs.org/) | **20.19+** | `node -v` |
| [Cursor](https://cursor.com/) | Recent | Primary workshop IDE |

### Part 2 only — Spec-Driven (`workshop/sdd`)

| Tool | Install | Verify |
|------|---------|--------|
| OpenSpec CLI | `npm install -g @fission-ai/openspec@latest` | `openspec --version` |
| CodeGraph CLI | See [Install CodeGraph](#install-codegraph) | `codegraph version` |

### Optional (local dev without Docker)

- Python 3.12+ and pip (backend)
- Node.js 22+ (frontend)

---

## Installation Strategy: Repo vs. In-Person

### What goes in the repository (`workshop/sdd` branch only)

`main` does not contain OpenSpec. After checking out `workshop/sdd` you will find:

```
openspec/
  config.yaml          ← TaskFlow project context for the AI
.cursor/
  commands/            ← slash commands: /opsx:propose, /opsx:apply, etc.
  skills/              ← OpenSpec skills for Cursor
docs/
  WORKSHOP.md          ← this guide (present on all branches)
  PROMPT.md            ← canonical workshop prompt
```

Participants do **not** need to run `openspec init` — the facilitator does that when creating `workshop/sdd`.

### What does NOT go in the repository

| File / config | Reason |
|---------------|--------|
| `.codegraph/` | Local SQLite index, machine-specific (gitignored) |
| Cursor MCP config (`~/.cursor/`) | Global IDE config per participant |
| OpenSpec CLI | Global npm package, not embeddable in the repo |

### Participant setup (Part 2)

```bash
git clone <repo-url>
cd taskflow
git checkout workshop/sdd

# OpenSpec CLI
npm install -g @fission-ai/openspec@latest
openspec update

# CodeGraph CLI + MCP
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
codegraph install --target=cursor --yes
codegraph init
```

**Restart Cursor** after setup.

### Prepare the `workshop/sdd` branch (facilitator — one time)

OpenSpec is **not** initialized on `main`. The facilitator sets it up when creating the SDD branch:

```bash
git checkout -b workshop/sdd        # from main
npm install -g @fission-ai/openspec@latest
openspec init --tools cursor --force
# Edit openspec/config.yaml with TaskFlow context (see OpenSpec docs)
openspec update
git add openspec/ .cursor/
git commit -m "Add OpenSpec config for SDD workshop branch"
git push -u origin workshop/sdd
```

Run this **once** when creating the branch.

---

## Manual Installation (Reference)

### Install OpenSpec

Requires Node.js 20.19+.

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Docs: [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)

### Install CodeGraph

**Option A — standalone installer (no Node required):**

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh

# Windows (PowerShell)
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

**Option B — npm (if you already have Node):**

```bash
npm install -g @colbymchenry/codegraph
```

Open a **new terminal** after installing.

Docs: [github.com/colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)

### Connect CodeGraph to Cursor

```bash
codegraph install --target=cursor --yes
```

This writes MCP config into Cursor. **Restart Cursor** afterward.

### Index TaskFlow

```bash
cd taskflow
codegraph init
codegraph status    # verify: nodes, edges, indexed files
```

On TaskFlow the index takes ~200 ms (~33 files, ~230 nodes).

---

## Run the Application

```bash
cd taskflow
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API docs | http://localhost:8000/docs |
| Health | http://localhost:8000/health |

Pre-loaded demo data:

- **Web App Launch** — Setup Database (done), Implement API (in progress), Build Frontend, Deploy
- **API Migration** — Audit endpoints (done), Write migration plan (in progress)

Useful commands:

```bash
make up       # start services in background
make test     # run backend + frontend tests
make seed     # re-seed demo data
make reset    # wipe DB and restart
make logs     # tail logs
```

---

## Workshop Flow — Step by Step

### Before the event (facilitator)

1. Confirm branches exist: `main`, `workshop/bare`, `workshop/sdd`.
2. Create `workshop/sdd` with OpenSpec if it does not exist yet:
   ```bash
   git checkout -b workshop/sdd
   npm install -g @fission-ai/openspec@latest
   openspec init --tools cursor --force
   openspec update
   git add openspec/ .cursor/
   git commit -m "Add OpenSpec config for SDD workshop branch"
   ```
3. Confirm `main` and `workshop/bare` do **not** have `openspec/` or `.cursor/`.
4. Dry-run the full flow on a clean machine: checkout `workshop/sdd`, install tools, run the app.
5. Have TaskFlow running on http://localhost:3000 for the projector.
6. Keep [docs/PROMPT.md](./PROMPT.md) visible for copying the canonical prompt.
7. Reserve **15 minutes** at the start of Part 2 for tool setup (or ask participants to install beforehand).

### Part 1 — Vibe Coding (~45 min)

**Branch:** `workshop/bare`  
**Tools:** Cursor only (no OpenSpec, no CodeGraph)

| Step | Action | Duration |
|------|--------|----------|
| 1 | `git checkout workshop/bare` | 1 min |
| 2 | `docker compose up --build` | 2 min |
| 3 | Explore the app at http://localhost:3000 | 5 min |
| 4 | Walk through architecture (routes → service → repository) | 10 min |
| 5 | Copy the Part 1 prompt from [PROMPT.md](./PROMPT.md) into Cursor | 1 min |
| 6 | Implement with vibe coding — direct prompt, no spec | 25 min |
| 7 | Quick demo + discussion: what went well / poorly? | 5 min |

**Part 1 prompt** (paste exactly into Cursor):

```
Add task dependencies to the application.

Users should be able to define that one task depends on another.
The system must prevent circular dependencies.
Tasks that have incomplete dependencies should show as blocked.
Add API endpoints and update the frontend to show dependencies and a graph view.
Add tests.
```

### Part 2 — Spec-Driven Development (~60 min)

**Branch:** `workshop/sdd`  
**Tools:** Cursor + OpenSpec + CodeGraph

| Step | Action | Duration |
|------|--------|----------|
| 1 | `git checkout workshop/sdd` | 1 min |
| 2 | Install OpenSpec + CodeGraph (see [Participant setup](#participant-setup-part-2)) + restart Cursor | 10 min |
| 3 | Verify: `codegraph status` and `/opsx:propose` available | 2 min |
| 4 | Explore architecture with CodeGraph (facilitator demo) | 5 min |
| 5 | Run `/opsx:propose add-task-dependencies` | 5 min |
| 6 | Review generated artifacts with the group | 10 min |
| 7 | Run `/opsx:apply` | 25 min |
| 8 | Run tests: `make test` | 3 min |
| 9 | Demo + compare Part 1 vs Part 2 | 5 min |

**OpenSpec commands in Cursor:**

| Command | When to use |
|---------|-------------|
| `/opsx:explore` | Explore ideas before committing |
| `/opsx:propose add-task-dependencies` | Create spec, design, and tasks |
| `/opsx:apply` | Implement according to the spec |
| `/opsx:archive` | Archive the change when done |

**Reinforcement prompt** (optional, after `/opsx:apply`):

```
Implement add-task-dependencies according to the specification.
Use CodeGraph to understand the existing architecture before making changes.
Follow the patterns in repositories/ and services/ layers.
Ensure all scenarios in the delta specs have corresponding tests.
```

### Expected feature scope

See the full table in [PROMPT.md](./PROMPT.md). Summary:

| Area | Requirement |
|------|-------------|
| Entity | `TaskDependency(id, parent_task_id, child_task_id, created_at)` |
| Business rule | Task B depends on A → B blocked until A is done |
| Validation | Reject circular dependencies |
| API | `POST/DELETE/GET /tasks/{id}/dependencies`, `GET /projects/{id}/graph` |
| Frontend | Depends On / Blocking sections, blocked indicator, graph view |
| Tests | Backend: create, cycle, graph, unblock. Frontend: render, blocked state |

---

## CodeGraph Demo (facilitator)

Before Part 2, show the difference with an architecture question.

In Cursor chat (with CodeGraph active):

```
How does a request flow from the API route to the database in TaskFlow?
```

CodeGraph should surface the flow:

```
routes.py → ProjectService/TaskService → Repository → SQLModel → SQLite
```

From the terminal:

```bash
codegraph explore "How does task creation work?"
codegraph explore "TaskService"
```

---

## Repository Branches

| Branch | Purpose | OpenSpec | CodeGraph |
|--------|---------|----------|-----------|
| `main` | Base app without dependencies feature | **No** | **No** |
| `workshop/bare` | Vibe coding demo | **No** | **No** |
| `workshop/sdd` | Spec-driven demo | Yes (pre-configured when branch is created) | Local setup per participant |

---

## Troubleshooting

### OpenSpec

| Issue | Fix |
|-------|-----|
| `openspec: command not found` | `npm install -g @fission-ai/openspec@latest` — restart terminal |
| `/opsx:propose` missing in Cursor | Restart Cursor; confirm `.cursor/commands/` exists on the branch |
| Node.js too old | OpenSpec requires Node 20.19+. Update from nodejs.org |

### CodeGraph

| Issue | Fix |
|-------|-----|
| `codegraph: command not found` | Reinstall with install.sh; open a new terminal |
| MCP not connecting in Cursor | `codegraph install --target=cursor --yes` → restart Cursor |
| "CodeGraph not initialized" | `codegraph init` at the project root |
| Stale index | Auto-sync is on by default; or run `codegraph sync` manually |

### TaskFlow

| Issue | Fix |
|-------|-----|
| Port 3000/8000 in use | Change `FRONTEND_PORT` / `BACKEND_PORT` in `.env` |
| Slow build | First build ~90 s; subsequent builds < 30 s |
| Empty DB | `make seed` |

---

## Participant Checklist

### Before the workshop

- [ ] Docker Desktop installed and running
- [ ] Cursor installed
- [ ] Node.js 20.19+ installed
- [ ] Repo cloned: `git clone <repo-url>`

### Part 1 (vibe coding)

- [ ] `git checkout workshop/bare`
- [ ] `docker compose up --build`
- [ ] App visible at http://localhost:3000

### Part 2 (spec-driven)

- [ ] `git checkout workshop/sdd`
- [ ] OpenSpec + CodeGraph installed (see [Participant setup](#participant-setup-part-2))
- [ ] Cursor restarted
- [ ] `codegraph status` shows a healthy index
- [ ] `/opsx:propose` available in Cursor

---

## References

- [OpenSpec](https://github.com/Fission-AI/OpenSpec) · [openspec.dev](https://openspec.dev/)
- [CodeGraph](https://github.com/colbymchenry/codegraph) · [colbymchenry.github.io/codegraph](https://colbymchenry.github.io/codegraph/)
- [Canonical workshop prompt](./PROMPT.md)
- [Project README](../README.md)
