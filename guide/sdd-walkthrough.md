# SDD walkthrough — clone to done

Step-by-step from cloning the repo through implementing Task Dependencies with spec-driven development.

**Branch:** `workshop/sdd` · **Feature:** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

---

## Phase 1 — Clone and run the app

### 1. Clone the repo

**macOS / Linux**

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
```

**Windows (PowerShell)**

```powershell
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
```

### 2. Checkout the SDD branch

```bash
git checkout workshop/sdd
```

### 3. Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Miniconda](https://www.anaconda.com/download/success) (Python 3.12)
- [Node.js](https://nodejs.org/) (LTS)
- An AI IDE with agent support (Cursor, Claude Code, etc.)

Details: [local-development.md](./local-development.md)

### 4. Start the app

**macOS / Linux**

```bash
make dev
```

**Windows (PowerShell)**

```powershell
.\scripts\dev-local.ps1
```

First run creates the `task-flow` conda env, installs dependencies, and copies `.env` if missing.

### 5. Verify it works

| Service | URL |
| ------- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API docs | [http://localhost:8000/docs](http://localhost:8000/docs) |

Browse projects and tasks. There are no task dependencies yet — that is what you will build.

Keep the dev server running in a terminal (or restart it before testing later).

---

## Phase 2 — Install agent tooling

### 6. Install agent tooling

```bash
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
```

### 7. Initialize CodeGraph

```bash
codegraph init
```

Do not commit `.codegraph/` — it is gitignored and rebuilt locally.

### 8. Enable CodeGraph MCP (Cursor)

The repo ships `ai-agents/mcp.json` (symlinked as `.mcp.json` and `.cursor/mcp.json`).

1. Run `codegraph init` (step 7)
2. Reload Cursor: **Settings → MCP**
3. Confirm the `codegraph` server is connected

**Rule:** agents must use CodeGraph before exploring code — no grep or self-directed search. See [codegraph.md](../openspec/constitution/codegraph.md).

OpenSpec and the project constitution are already in the repo — **no `openspec init` needed**.

---

## Phase 3 — Understand the task

### 9. Read the agent rules

Skim [AGENTS.md](../AGENTS.md) — layer flow, migration rules, API conventions, SDD workflow.

Constitution files (injected into every OpenSpec change): `openspec/constitution/`

### 10. Read the minimal user story

Open [user-story-task-dependencies.md](./user-story-task-dependencies.md).

This is your **only input** — intentionally incomplete. No API contracts, no test names, no layer paths. SDD starts here; you enrich it in the next phase.

---

## Phase 4 — Enrich the spec

### 11. Run enrich-story

In your AI IDE:

```
/enrich-story
```

The agent follows `ai-agents/skills/enrich-user-story/SKILL.md`:

1. CodeGraph explore (task dependencies, routes, models, frontend)
2. Read minimal story + constitution
3. Write `guide/user-story-enriched.md`

### 12. Review the enriched story

Open `guide/user-story-enriched.md` (local only, gitignored).

Confirm it includes:

- Scope table with layer paths
- TaskDependency model and FR-1 through FR-4
- Four API endpoints (no `/api` prefix, 422 for business rules)
- Frontend: Depends on, Blocking, graph view
- Named backend and frontend tests
- Definition of Done with migration commands

Fix gaps with the agent before proceeding.

---

## Phase 5 — Propose the change (OpenSpec)

### 13. Propose with OpenSpec

Attach `guide/user-story-enriched.md` to the chat, then:

```
/opsx:propose task-dependencies
```

OpenSpec generates artifacts under `openspec/changes/task-dependencies/`:

- `proposal.md` — what and why
- `design.md` — how
- `specs/` — requirements
- `tasks.md` — implementation checklist

### 14. Review artifacts

Read each file. Adjust with the agent if scope, design, or tasks are wrong.

Optional — think before proposing:

```
/opsx:explore task-dependencies
```

---

## Phase 6 — Implement

### 15. Apply the change

```
/opsx:apply
```

The agent implements `tasks.md` in order:

1. CodeGraph `node` before editing each file
2. Model → migration → schemas → manager → controller → routes → frontend → tests
3. `make dev-migrate-create` then `make dev-migrate` for schema changes

Follow [AGENTS.md](../AGENTS.md) and the constitution throughout.

### 16. Run tests

**macOS / Linux**

```bash
make dev-test
```

**Windows** — see [local-development.md](./local-development.md) § Run tests.

All tests must pass before you consider the feature done.

### 17. Verify in the browser

With `make dev` running:

1. Open a project at [http://localhost:3000](http://localhost:3000)
2. Create dependencies between tasks
3. Confirm blocked state and graph view work
4. Try creating a circular dependency — expect 422 from the API

---

## Phase 7 — Close and compare

### 18. Archive the change

```
/opsx:archive
```

Marks the OpenSpec change complete and syncs specs.

### 19. Commit your work

Protected branches cannot be pushed by participants — commit locally:

```bash
git add -A
git status
git commit -m "Implement task dependencies"
```

### 20. Compare tracks

Follow [compare.md](./compare.md):

```bash
git diff workshop/vibe-coding...workshop/sdd --stat
```

Discuss: what did vibe coding miss? What did SDD get right from the spec?

---

## Quick reference — commands

| Step | Command |
| ---- | ------- |
| Enrich | `/enrich-story` |
| Propose | `/opsx:propose task-dependencies` |
| Implement | `/opsx:apply` |
| Archive | `/opsx:archive` |
| Explore (optional) | `/opsx:explore` |

## Related guides

| Guide | When |
| ----- | ---- |
| [local-development.md](./local-development.md) | Dev server, migrations, tests |
| [docker.md](./docker.md) | Full stack in containers |
| [workshop.md](./workshop.md) | SDD concepts and tooling summary |
| [compare.md](./compare.md) | Debrief diff commands |
