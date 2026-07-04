# User Story: Task Dependencies & Dependency Graph

> **Workshop feature** — demonstrates spec-driven development across database, API, business logic, frontend, and tests.

## Story

**As a** project member  
**I want** to define dependencies between tasks and see which work is blocked  
**So that** the team respects execution order and avoids starting work too early

## Business Problem

Certain tasks cannot start until other tasks are completed.

```
Setup Database
      ↓
Implement API
      ↓
Build Frontend
      ↓
Deploy
```

The application must model, validate, and surface these relationships.

---

## Scope

| Layer | Change |
| ----- | ------ |
| Database | New `TaskDependency` entity |
| API | CRUD + graph endpoint |
| Business logic | Cycle detection, blocked-state resolution |
| Frontend | Task detail + graph view |
| Tests | Backend + frontend coverage |

---

## Data Model

### TaskDependency

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | UUID | Primary key |
| `parent_task_id` | UUID | Task that must complete first (prerequisite) |
| `child_task_id` | UUID | Task that depends on the parent |
| `created_at` | timestamp | UTC |

**Semantics:** `child_task_id` depends on `parent_task_id` (child is blocked until parent is `done`).

**Constraints:**
- Both tasks must belong to the same project
- A task cannot depend on itself
- Duplicate `(parent_task_id, child_task_id)` pairs are rejected

---

## Functional Requirements

### FR-1: Create dependency

A user can define: **Task B depends on Task A**.

- **Given** Task A and Task B exist in the same project  
- **When** the user creates a dependency A → B  
- **Then** B is blocked until A is marked `done`

### FR-2: Prevent circular dependencies

The system must reject cycles.

**Example (invalid):**

```
Task A → Task B → Task C → Task A
```

- **When** a new dependency would create a cycle  
- **Then** return `400` with a clear error message  
- **And** no row is persisted

### FR-3: Determine task readiness

The system automatically classifies each task:

| State | Rule |
| ----- | ---- |
| **Ready** | Status is `todo`, all prerequisites are `done` |
| **Blocked** | Status is `todo`, at least one prerequisite is not `done` |
| **In progress** | Status is `in_progress` (unchanged by dependencies) |
| **Done** | Status is `done` (unchanged by dependencies) |

Blocked tasks cannot be moved to `in_progress` until all prerequisites are `done`.

### FR-4: Delete dependency

A user can remove an existing dependency. After deletion, blocked-state is recalculated.

---

## API Specification

Base URL: `/api` (existing TaskFlow API)

### Create dependency

```
POST /tasks/{task_id}/dependencies
```

`task_id` = child task (the dependent task).

**Request body:**

```json
{
  "parent_task_id": "uuid-of-prerequisite"
}
```

**Responses:**

| Code | Meaning |
| ---- | ------- |
| `201` | Dependency created |
| `400` | Self-dependency, cross-project, duplicate, or cycle |
| `404` | Task or parent not found |

### Delete dependency

```
DELETE /tasks/{task_id}/dependencies/{dependency_id}
```

**Responses:** `204` on success, `404` if not found.

### List dependencies for a task

```
GET /tasks/{task_id}/dependencies
```

**Response:**

```json
{
  "depends_on": [
    { "id": "...", "task_id": "...", "title": "Setup Database", "status": "done" }
  ],
  "blocking": [
    { "id": "...", "task_id": "...", "title": "Deploy", "status": "todo" }
  ]
}
```

### Project dependency graph

```
GET /projects/{project_id}/graph
```

**Response:**

```json
{
  "nodes": [
    { "id": "...", "title": "Setup Database", "status": "done", "readiness": "done" }
  ],
  "edges": [
    { "from": "parent-uuid", "to": "child-uuid" }
  ]
}
```

---

## Frontend Requirements

### Task detail page

**Depends on** — list prerequisite tasks with links.

**Blocking** — list tasks that wait on this one.

**Status indicators:**

| Indicator | Meaning |
| --------- | ------- |
| Ready | Can be started |
| In progress | Currently active |
| Blocked | Waiting on unfinished prerequisites |

### Dependency graph view (project level)

Render a tree or DAG for the project, e.g.:

```
Task A
 ├── Task B
 │    └── Task D
 └── Task C
```

- Nodes reflect current status (ready / in progress / blocked / done)
- Clicking a node opens the task detail page
- Empty state when the project has no dependencies

---

## Test Plan

### Backend

| Test | Verifies |
| ---- | -------- |
| `test_create_dependency` | Valid dependency is persisted |
| `test_prevent_circular_dependency` | Cycle returns `400` |
| `test_get_dependency_graph` | Graph endpoint returns nodes + edges |
| `test_unblock_task` | Completing parent unblocks child |

### Frontend

| Test | Verifies |
| ---- | -------- |
| Dependencies render | Depends on / Blocking sections show linked tasks |
| Blocked tasks display | Blocked indicator when prerequisites incomplete |
| Graph updates | Graph reflects new dependency after create |

---

## Out of Scope (workshop)

- Multi-project dependencies
- Soft-delete / dependency history
- Drag-and-drop graph editing
- Notifications when a task becomes unblocked

---

## Definition of Done

- [ ] Migration creates `task_dependency` table
- [ ] All API endpoints implemented with validation
- [ ] Circular dependency check in business layer
- [ ] Task detail shows Depends on / Blocking
- [ ] Project graph view renders
- [ ] All required tests pass
- [ ] README or workshop notes reference this spec
