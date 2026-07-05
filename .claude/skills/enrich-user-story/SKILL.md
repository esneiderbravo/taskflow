---
name: enrich-user-story
description: Enrich a minimal user story into a full workshop spec using CodeGraph and project constitution. Use before /opsx:propose in the SDD workshop track.
---

Enrich the minimal user story into a complete specification document.

**Output:** `guide/user-story-enriched.md` (participant-generated; gitignored)

**Do NOT read** `guide/reference/user-story-enriched.md` — that is facilitator-only.

---

## Prerequisites

- Minimal story exists at `guide/user-story-task-dependencies.md`
- CodeGraph initialized (`codegraph init`)
- Constitution at `openspec/constitution/`

## Steps

### 1. CodeGraph exploration (mandatory — no grep/search first)

```bash
codegraph explore task dependencies
codegraph explore ProjectManager TaskManager
codegraph explore routes.py
codegraph node backend/app/api/routes.py
codegraph node frontend/lib/api.ts
codegraph node frontend/app/projects
```

Or MCP: `codegraph_explore`, then `codegraph_node` for each file above.

Extract from graph output:
- Existing route patterns (no `/api` prefix)
- Manager/controller file locations
- Frontend page structure (`/projects/{id}`, `TaskList`)
- Task status enum values (`todo`, `in_progress`, `done`)

### 2. Read inputs (only these files for standards)

| File | Purpose |
| ---- | ------- |
| `guide/user-story-task-dependencies.md` | Minimal story — preserve intent |
| `guide/templates/user-story-enriched.template.md` | Required section structure |
| `openspec/constitution/architecture.md` | Layer flow |
| `openspec/constitution/backend-standards.md` | MVC, naming |
| `openspec/constitution/frontend-standards.md` | UI patterns |
| `openspec/constitution/api-standards.md` | URLs, status codes (422 not 400 for cycles) |
| `openspec/constitution/migrations.md` | Autogenerate workflow |
| `openspec/constitution/testing-standards.md` | Test names and patterns |

### 3. Write enriched story

Create **`guide/user-story-enriched.md`** following the template exactly.

#### Mandatory content checklist

- [ ] Title: Task Dependencies & Dependency Graph
- [ ] Story (As/I want/So that) from minimal input
- [ ] Business Problem with Setup→API→Frontend→Deploy diagram
- [ ] Scope table with all 7 layers and concrete paths
- [ ] TaskDependency data model table (4 fields + constraints + ORM note)
- [ ] FR-1 through FR-4 with Given/When/Then where applicable
- [ ] FR-2 cycle example + **422** response (not 400)
- [ ] FR-3 readiness table (Ready, Blocked, In progress, Done)
- [ ] All 4 API endpoints with methods, paths, bodies, response codes
- [ ] GET dependencies JSON shape (`depends_on`, `blocking`)
- [ ] GET graph JSON shape (`nodes`, `edges` with readiness)
- [ ] Base URL note: no `/api` prefix
- [ ] Frontend: extend `/projects/{id}`, Depends on / Blocking / graph view
- [ ] Status indicators table
- [ ] Backend test table (4 named tests)
- [ ] Frontend test table (3 behaviors)
- [ ] Out of Scope (4 items minimum)
- [ ] Definition of Done (7 checkboxes including migrate commands + dev-test)

#### Technical alignment (must match codebase)

| Topic | Value |
| ----- | ----- |
| API prefix | None — `/tasks/...`, `/projects/...` |
| Cycle/validation errors | HTTP 422 |
| Table name | `task_dependency` |
| Status enum | `todo`, `in_progress`, `done` |
| Architecture | routes → controller → manager → model |
| Migration | `make dev-migrate-create` then `make dev-migrate` |
| Frontend API | `frontend/lib/api.ts` |
| UI location | `/projects/{id}` with `TaskList` |

Use CodeGraph findings to cite real file paths — do not invent layers.

### 4. Self-review

Before finishing, verify:

1. Every template section is present
2. No `/api` prefix anywhere
3. Business rule failures use 422
4. All 4 FRs covered
5. Test names match workshop requirements exactly
6. Output is self-contained (readable without reading minimal story)

### 5. Report to user

Tell the user:
- Output written to `guide/user-story-enriched.md`
- Next step: attach it to `/opsx:propose task-dependencies`
- Do not commit enriched file unless they choose to (gitignored by default)

## Do not

- Read `guide/reference/` (facilitator answer key)
- Use grep, codebase_search, or directory scans before CodeGraph
- Skip any template section
- Use `/api` prefix
- Use 400 for cycle detection (use 422)
- Hand-write migration instructions without mentioning autogenerate
