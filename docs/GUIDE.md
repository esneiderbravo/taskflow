# 📘 Workshop Guide: Spec-Driven Development (SDD)

This track builds **Task Dependencies** using [OpenSpec](https://github.com/Fission-AI/OpenSpec) — a lightweight spec framework for AI coding assistants. You align on what to build **before** writing code, then implement from structured artifacts.

**Workshop spec (source material):** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

**OpenSpec:** [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)

---

## 🚀 Before you start

### 1. Run TaskFlow

```bash
git checkout workshop/sdd
make dev    # recommended: hot reload
# or
make up     # full Docker
```

Open the application at [http://localhost:3000](http://localhost:3000).

### 2. Install OpenSpec

Requires **Node.js 20.19+**.

```bash
npm install -g @fission-ai/openspec@latest
```

### 3. Initialize OpenSpec in this repo

From the project root:

```bash
openspec init
```

This configures your AI assistant with OpenSpec slash commands and creates the `openspec/` folder structure.

---

## 🧭 SDD workflow with OpenSpec

OpenSpec turns requirements into artifacts your AI can follow: **proposal → specs → design → tasks → implementation**.

```
docs/user-story-task-dependencies.md
              ↓
        /opsx:propose
              ↓
   openspec/changes/<change-name>/
     ├── proposal.md
     ├── specs/
     ├── design.md
     └── tasks.md
              ↓
         /opsx:apply
              ↓
        working code + tests
              ↓
        /opsx:archive
```

### Step 1: 📖 Read the workshop spec

Read [user-story-task-dependencies.md](./user-story-task-dependencies.md) in full. This is your **input** for OpenSpec — not something you implement from memory.

Understand:

- 🗄️ Data model (`TaskDependency`)
- ⚖️ Business rules (no cycles, blocked vs ready)
- 🔌 API contracts
- 🖥️ Frontend requirements
- 🧪 Required tests

### Step 2: 🔍 Explore (optional)

If you want to think through the approach before committing to a change, use explore mode in your AI assistant:

```
/opsx:explore
```

Discuss trade-offs (graph storage, cycle detection, UI layout) against the existing TaskFlow codebase. No files are created yet.

### Step 3: 📝 Propose the change

Create an OpenSpec change from the workshop user story. In your AI assistant:

```
/opsx:propose task-dependencies
```

Then provide the content of [user-story-task-dependencies.md](./user-story-task-dependencies.md) as context, or ask the AI to read that file.

OpenSpec generates:

| Artifact | Purpose |
| -------- | ------- |
| `proposal.md` | Why we are building this, scope, impact |
| `specs/` | Requirements and scenarios |
| `design.md` | Technical approach for TaskFlow's stack |
| `tasks.md` | Implementation checklist |

Review every artifact. Edit anything that does not match the workshop spec before moving on.

### Step 4: ✅ Align before coding

Do **not** skip this step. Confirm:

- [ ] API endpoints match the user story
- [ ] Cycle prevention is specified
- [ ] Blocked / ready logic is defined
- [ ] Frontend sections (Depends on, Blocking, graph view) are covered
- [ ] Required tests are listed in `tasks.md`

OpenSpec exists so human and AI agree here — not in chat history.

### Step 5: ⚡ Apply the change

Implement from the generated tasks. In your AI assistant:

```
/opsx:apply
```

Work through `tasks.md` in order. For TaskFlow, typical layers:

| Layer | Location |
| ----- | -------- |
| Models | `backend/app/models/` |
| Managers | `backend/app/managers/` |
| Controllers | `backend/app/api/controllers/` |
| Routes | `backend/app/api/routes.py` |
| Migrations | `backend/alembic/versions/` |
| Frontend | `frontend/app/`, `frontend/components/` |
| Tests | `backend/app/tests/`, `frontend/tests/` |

When the schema changes:

```bash
make dev-migrate-create MSG="add task dependencies"
make dev-migrate
```

Run tests as you go:

```bash
make dev-test
```

### Step 6: 🧪 Verify against the spec

Required tests from the user story:

**Backend:** `test_create_dependency`, `test_prevent_circular_dependency`, `test_get_dependency_graph`, `test_unblock_task`

**Frontend:** dependencies render, blocked tasks display, graph updates

Check the **Definition of Done** section in [user-story-task-dependencies.md](./user-story-task-dependencies.md).

Optionally run OpenSpec verify in your AI assistant:

```
/opsx:verify
```

### Step 7: 📦 Archive the change

When the feature is complete:

```
/opsx:archive
```

This archives the change under `openspec/changes/archive/` and updates project specs for the next feature.

---

## 💡 Tips for this track

- **OpenSpec is the process; the user story is the content.** Use `user-story-task-dependencies.md` to feed `/opsx:propose`, not as a substitute for artifacts.
- **Iterate freely** — update any artifact (`proposal.md`, `design.md`, `tasks.md`) if you discover gaps.
- **Clear context** before `/opsx:apply` for better AI results.
- **Use the code graph** (if available) alongside OpenSpec to trace cross-layer impact.
- Compare outcomes with the **vibe coding** track (`workshop/vibe-coding`) in the debrief.

---

## 📦 Quick reference

### OpenSpec

| Action | Command |
| ------ | ------- |
| 🔧 Install | `npm install -g @fission-ai/openspec@latest` |
| 🏁 Initialize | `openspec init` |
| 🔄 Refresh skills | `openspec update` |
| 🔍 Explore | `/opsx:explore` |
| 📝 Propose | `/opsx:propose task-dependencies` |
| ⚡ Implement | `/opsx:apply` |
| ✅ Verify | `/opsx:verify` |
| 📦 Archive | `/opsx:archive` |

### TaskFlow

| Action | Command |
| ------ | ------- |
| 🚀 Start app | `make dev` |
| 📝 New migration | `make dev-migrate-create MSG="..."` |
| 📜 Apply migrations | `make dev-migrate` |
| 🧪 Run tests | `make dev-test` |
| 🔄 Reset database | `make dev-reset` |

### Learn more

- [OpenSpec on GitHub](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec documentation](https://openspec.dev/)
