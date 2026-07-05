# Enriched user story template

Use this structure when running `/enrich-story`. Every section is **required**.

---

## Title

`# User Story: Task Dependencies & Dependency Graph`

Workshop feature subtitle.

## Story

Keep the As/I want/So that from the minimal story (may refine wording).

## Business Problem

Expand the Description with the pipeline example (Setup Database → Implement API → Build Frontend → Deploy).

## Scope

Table with columns: **Layer | Location | Change**

Must include all rows:
- Database → `backend/app/models/`
- Migration → `backend/alembic/versions/` (autogenerate)
- Schemas → `backend/app/schemas.py`
- Business logic → `backend/app/managers/`
- API → `backend/app/api/controllers/`, `routes.py`
- Frontend → `frontend/lib/api.ts`, `hooks/`, `components/`
- Tests → `backend/app/tests/`, `frontend/tests/`

Note: follow `openspec/constitution/`, CodeGraph first.

## Data Model — TaskDependency

Fields table: id (UUID), parent_task_id, child_task_id, created_at (UTC).

Semantics: child depends on parent; child blocked until parent is `done`.

Constraints: same project, no self-link, no duplicates.

ORM: `__tablename__ = "task_dependency"`, export from `models/__init__.py`.

## Functional Requirements

### FR-1: Create dependency
Given/When/Then — B depends on A, B blocked until A is `done`.

### FR-2: Prevent circular dependencies
Invalid example diagram A→B→C→A. Return `422`, no persist.

### FR-3: Determine task readiness
Table: Ready, Blocked, In progress, Done — with rules from task status + prerequisites.

Blocked `todo` cannot move to `in_progress` until prerequisites `done`.

### FR-4: Delete dependency
Remove link; recalculate blocked state.

## API Specification

Base: `http://localhost:8000`, **no `/api` prefix**. routes → controller → manager → model.

### POST /tasks/{task_id}/dependencies
- task_id = child
- Body: `{ "parent_task_id": "uuid" }`
- 201 created, 404 not found, 422 business rules

### DELETE /tasks/{task_id}/dependencies/{dependency_id}
- 204 success, 404 not found

### GET /tasks/{task_id}/dependencies
- Response: `depends_on` and `blocking` arrays with id, task_id, title, status

### GET /projects/{project_id}/graph
- Response: `nodes` (id, title, status, readiness), `edges` (from, to)

Mirror endpoints in `frontend/lib/api.ts`.

## Frontend Requirements

Extend `/projects/{id}` (existing `TaskList`).

Per task: **Depends on**, **Blocking**, status indicators (Ready, In progress, Blocked).

Graph view on project page: tree/DAG, status on nodes, click → task, empty state.

Use `status-*` Tailwind tokens.

## Test Plan

Backend: test_create_dependency, test_prevent_circular_dependency (422), test_get_dependency_graph, test_unblock_task

Frontend: dependencies render, blocked display, graph updates

## Out of Scope

Multi-project deps, soft-delete history, drag-drop graph, notifications.

## Definition of Done

Checkboxes: model + autogenerate migration + apply, API layers, cycle check in manager, lib/api.ts, UI sections, graph view, make dev-test passes.
