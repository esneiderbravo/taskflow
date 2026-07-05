---
name: enrich-user-story
description: Enrich a minimal user story into a full workshop spec using CodeGraph and project constitution. Use before /opsx:propose in the SDD workshop track.
---

Transform a minimal user story into a **complete, implementation-ready specification**.

**Input:** `guide/user-story-task-dependencies.md`  
**Output:** `guide/user-story-enriched.md` (participant-generated; gitignored)

The enriched document must stand alone — an implementer should not need to read the minimal story.

---

## What makes a good enriched user story

A minimal story states *what* the user wants. Enrichment adds *how the system delivers it* across every layer.

| Principle | Practice |
| --------- | -------- |
| **Preserve intent** | Keep the As/I want/So that from the minimal story; refine wording only for clarity |
| **Make implicit explicit** | Turn vague acceptance criteria into data models, API contracts, UI behaviors, and edge cases |
| **Ground in the codebase** | Use CodeGraph to cite real file paths — never invent layers or folders |
| **Be testable** | Write Given/When/Then for business rules; name concrete tests implementers must pass |
| **Contract-first APIs** | Specify method, path, request body, response shape, and status codes per endpoint |
| **Scope boundaries** | Out of Scope prevents feature creep; Definition of Done defines "shippable" |

---

## Prerequisites

- Minimal story at `guide/user-story-task-dependencies.md`
- CodeGraph initialized (`codegraph init`)
- Constitution at `openspec/constitution/`

---

## Step 1 — CodeGraph exploration (mandatory)

**No grep, semantic search, or directory scans before CodeGraph.**

```bash
codegraph explore task dependencies
codegraph explore ProjectManager TaskManager
codegraph node backend/app/api/routes.py
codegraph node backend/app/models/task.py
codegraph node frontend/lib/api.ts
codegraph node frontend/app/projects
```

Or MCP: `codegraph_explore`, then `codegraph_node` per file.

Extract and use in the spec:
- Route patterns (root paths — **no `/api` prefix**)
- Layer locations: routes → controller → manager → model
- Task status values: `todo`, `in_progress`, `done`
- UI entry point: `/projects/{id}` with `TaskList`

---

## Step 2 — Read standards

| File | Use for |
| ---- | ------- |
| `guide/user-story-task-dependencies.md` | Story intent, acceptance criteria seeds |
| `openspec/constitution/architecture.md` | Layer flow, implementation order |
| `openspec/constitution/backend-standards.md` | MVC, naming, managers |
| `openspec/constitution/frontend-standards.md` | Components, hooks, Tailwind tokens |
| `openspec/constitution/api-standards.md` | URLs, status codes (422 for business rules) |
| `openspec/constitution/migrations.md` | Autogenerate workflow |
| `openspec/constitution/testing-standards.md` | Test naming and patterns |

---

## Step 3 — Write `guide/user-story-enriched.md`

Build the document section by section. Every section below is **required**.

### Title

`# User Story: Task Dependencies & Dependency Graph`

Add a one-line subtitle noting this is a cross-layer workshop feature.

### Story

Three lines: **As a** / **I want** / **So that** — derived from the minimal story.

### Business Problem

Expand the Description into a concrete scenario. Include a vertical pipeline diagram showing ordered work, e.g.:

```
Setup Database → Implement API → Build Frontend → Deploy
```

State why the system must model, validate, and surface these relationships.

### Scope

Table with columns **Layer | Location | Change**. Cover all seven layers:

| Layer | Typical location | What to specify |
| ----- | ---------------- | --------------- |
| Database | `backend/app/models/` | New model name and purpose |
| Migration | `backend/alembic/versions/` | Autogenerate — never hand-write |
| Schemas | `backend/app/schemas.py` | Pydantic DTOs needed |
| Business logic | `backend/app/managers/` | Validation, cycle detection, readiness |
| API | `backend/app/api/controllers/`, `routes.py` | New endpoints |
| Frontend | `frontend/lib/api.ts`, `hooks/`, `components/` | API client + UI |
| Tests | `backend/app/tests/`, `frontend/tests/` | pytest + vitest |

Use paths confirmed by CodeGraph. Note: follow `openspec/constitution/` and `AGENTS.md`.

### Data Model — TaskDependency

Fields table with type and notes:

| Field | Type | Role |
| ----- | ---- | ---- |
| `id` | UUID | Primary key |
| `parent_task_id` | UUID | Prerequisite (must complete first) |
| `child_task_id` | UUID | Dependent task |
| `created_at` | timestamp | UTC |

**Semantics:** child depends on parent; child is blocked until parent is `done`.

**Constraints:** same project only; no self-link; no duplicate pairs.

**ORM:** `__tablename__ = "task_dependency"`; export from `models/__init__.py`.

### Functional Requirements

Write four numbered requirements. Use Given/When/Then where behavior is conditional.

**FR-1: Create dependency** — user links B depends on A; B blocked until A is `done`.

**FR-2: Prevent circular dependencies** — include an invalid cycle diagram (A→B→C→A). On cycle: return `422`, do not persist. **Never use 400 for business rules.**

**FR-3: Determine task readiness** — table with states and rules:

| State | Rule |
| ----- | ---- |
| Ready | `todo`, all prerequisites `done` |
| Blocked | `todo`, at least one prerequisite not `done` |
| In progress | `in_progress` (unchanged by deps) |
| Done | `done` (unchanged by deps) |

Blocked `todo` tasks cannot move to `in_progress` until prerequisites are `done`.

**FR-4: Delete dependency** — remove link; recalculate blocked state.

### API Specification

Base URL: `http://localhost:8000` — **no `/api` prefix**. Architecture: routes → controller → manager → model. Mirror endpoints in `frontend/lib/api.ts`.

Specify all four endpoints with method, path, body, response codes, and JSON examples:

**POST /tasks/{task_id}/dependencies** — `task_id` is the child. Body: `{ "parent_task_id": "uuid" }`. Responses: `201`, `404`, `422`.

**DELETE /tasks/{task_id}/dependencies/{dependency_id}** — Responses: `204`, `404`.

**GET /tasks/{task_id}/dependencies** — Response shape:

```json
{
  "depends_on": [{ "id": "...", "task_id": "...", "title": "...", "status": "done" }],
  "blocking": [{ "id": "...", "task_id": "...", "title": "...", "status": "todo" }]
}
```

**GET /projects/{project_id}/graph** — Response shape:

```json
{
  "nodes": [{ "id": "...", "title": "...", "status": "done", "readiness": "done" }],
  "edges": [{ "from": "parent-uuid", "to": "child-uuid" }]
}
```

### Frontend Requirements

Extend `/projects/{id}` (existing `TaskList`).

Per task: **Depends on** (prerequisites with links), **Blocking** (dependents), status indicators (Ready, In progress, Blocked).

Project-level **dependency graph view**: tree/DAG layout, status on nodes, click opens task, empty state when no deps. Use `status-*` Tailwind tokens per frontend standards.

### Test Plan

**Backend** — name these four tests:

| Test | Verifies |
| ---- | -------- |
| `test_create_dependency` | Valid dependency persisted |
| `test_prevent_circular_dependency` | Cycle returns `422` |
| `test_get_dependency_graph` | Graph returns nodes + edges |
| `test_unblock_task` | Completing parent unblocks child |

**Frontend** — three behaviors:

| Test | Verifies |
| ---- | -------- |
| Dependencies render | Depends on / Blocking sections show linked tasks |
| Blocked tasks display | Blocked indicator when prerequisites incomplete |
| Graph updates | Graph reflects new dependency after create |

### Out of Scope

List at least four items the workshop will **not** build: multi-project deps, soft-delete history, drag-drop graph editing, unblock notifications.

### Definition of Done

Checkbox list (7 items minimum):

- [ ] `TaskDependency` model; migration autogenerated (`make dev-migrate-create`) and applied (`make dev-migrate`)
- [ ] All API endpoints (routes → controller → manager)
- [ ] Circular dependency check in manager layer
- [ ] `frontend/lib/api.ts` updated
- [ ] Project page shows Depends on / Blocking per task
- [ ] Project graph view renders
- [ ] `make dev-test` passes

---

## Hard requirements (non-negotiable)

| Topic | Value |
| ----- | ----- |
| API prefix | None — `/tasks/...`, `/projects/...` |
| Business rule errors | HTTP `422` |
| Not found | HTTP `404` |
| Create | HTTP `201` |
| Delete | HTTP `204` |
| Table name | `task_dependency` |
| Migration | `make dev-migrate-create` then `make dev-migrate` |

---

## Step 4 — Self-review

Before finishing, confirm the output has:

- [ ] All 12 sections above (Title through Definition of Done)
- [ ] FR-1 through FR-4 with Given/When/Then where applicable
- [ ] Cycle diagram in FR-2
- [ ] Readiness table in FR-3
- [ ] All 4 API endpoints with JSON examples
- [ ] No `/api` prefix anywhere
- [ ] Real file paths from CodeGraph in Scope table
- [ ] Named backend and frontend tests
- [ ] Document is self-contained

---

## Step 5 — Report to user

- Output written to `guide/user-story-enriched.md`
- Next step: attach to `/opsx:propose task-dependencies`

## Do not

- Use grep or codebase search before CodeGraph
- Copy from external answer keys or pre-written specs
- Use `/api` prefix or `400` for business rules
- Skip any required section
- Hand-write migration SQL — always autogenerate
