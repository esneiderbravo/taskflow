# Vibe coding walkthrough — clone to done

Step-by-step from cloning the repo through implementing Task Dependencies with a single AI prompt.

**Branch:** `workshop/vibe-coding` · **Feature:** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

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

### 2. Checkout the vibe coding branch

```bash
git checkout workshop/vibe-coding
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

## Phase 2 — Understand the task

### 6. Read the user story

Open [user-story-task-dependencies.md](./user-story-task-dependencies.md).

This is your **entire spec** — story, acceptance criteria, and a few notes. No enrichment step, no OpenSpec artifacts. You give this directly to the AI.

---

## Phase 3 — Implement with one prompt

### 7. Attach the user story

In your AI IDE, attach or paste `guide/user-story-task-dependencies.md` into the chat.

### 8. Send the prompt

```
Implement the feature described in guide/user-story-task-dependencies.md.
```

Let the agent explore the codebase and implement the feature. It will decide architecture, API shape, tests, and UI on its own.

**Tips:**

- Answer clarifying questions if the agent asks
- If it goes off track, steer it back to the acceptance criteria
- No slash commands or skills required on this branch

### 9. Run tests

**macOS / Linux**

```bash
make dev-test
```

**Windows** — see [local-development.md](./local-development.md) § Run tests.

Fix failures with the agent until tests pass.

### 10. Verify in the browser

With `make dev` running:

1. Open a project at [http://localhost:3000](http://localhost:3000)
2. Create dependencies between tasks
3. Confirm blocked state and graph view work
4. Try creating a circular dependency — the API should reject it

---

## Phase 4 — Close and compare

### 11. Commit your work

Protected branches cannot be pushed by participants — commit locally:

```bash
git add -A
git status
git commit -m "Implement task dependencies"
```

### 12. Compare tracks

Follow [compare.md](./compare.md):

```bash
git diff workshop/vibe-coding...workshop/sdd --stat
```

Discuss: what did vibe coding miss or guess wrong? What did SDD get right from a richer spec?

---

## Quick reference

| Step | Action |
| ---- | ------ |
| Input | `guide/user-story-task-dependencies.md` |
| Prompt | `Implement the feature described in guide/user-story-task-dependencies.md.` |
| Test | `make dev-test` |

## Related guides

| Guide | When |
| ----- | ---- |
| [local-development.md](./local-development.md) | Dev server, migrations, tests |
| [docker.md](./docker.md) | Full stack in containers |
| [workshop.md](./workshop.md) | Vibe coding summary |
| [compare.md](./compare.md) | Debrief diff commands |

Other track: `workshop/sdd` — enrich story → OpenSpec → implement (see that branch for the SDD walkthrough).
