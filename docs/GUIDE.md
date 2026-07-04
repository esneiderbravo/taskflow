# Workshop Guide: Spec-Driven Development (SDD)

This track implements **Task Dependencies** using the full specification before writing code.

**Spec:** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

---

## Before you start

```bash
git checkout workshop/sdd
make dev    # recommended: hot reload
# or
make up     # full Docker
```

Open the app at [http://localhost:3000](http://localhost:3000).

---

## SDD workflow

### Step 1: Read the spec end-to-end

Read [user-story-task-dependencies.md](./user-story-task-dependencies.md) completely before opening the editor.

Identify:

- Data model (`TaskDependency`)
- Business rules (no cycles, blocked vs ready)
- API contracts (request/response shapes)
- Frontend requirements (task detail + graph view)
- Required tests

Do **not** start coding until you can explain each section in your own words.

### Step 2: Map the spec to the codebase

Explore the existing layers:

| Layer | Location |
| ----- | -------- |
| Models | `backend/app/models/` |
| Managers | `backend/app/managers/` |
| Controllers | `backend/app/api/controllers/` |
| Routes | `backend/app/api/routes.py` |
| Schemas | `backend/app/schemas.py` |
| Migrations | `backend/alembic/versions/` |
| Frontend | `frontend/app/`, `frontend/components/` |
| Tests | `backend/app/tests/`, `frontend/tests/` |

List every file you expect to create or modify.

### Step 3: Database first

1. Add the `TaskDependency` SQLAlchemy model
2. Generate a migration:

```bash
make dev-migrate-create MSG="add task dependencies"
make dev-migrate
```

3. Verify the table exists before moving on

### Step 4: Business logic

Implement in the manager layer:

- Create dependency (validate same project, no self-link, no duplicates)
- **Cycle detection** before persisting
- Blocked / ready state resolution
- Delete dependency
- Fetch depends-on and blocking lists
- Build graph for a project

Write manager tests or API tests as you go.

### Step 5: API layer

Implement endpoints exactly as specified:

| Method | Path |
| ------ | ---- |
| `POST` | `/tasks/{id}/dependencies` |
| `DELETE` | `/tasks/{id}/dependencies/{dependency_id}` |
| `GET` | `/tasks/{id}/dependencies` |
| `GET` | `/projects/{id}/graph` |

Match status codes and error cases from the spec (`400` for cycles, `404` for missing resources).

### Step 6: Frontend

1. **Task detail** — Depends on / Blocking sections + status indicators
2. **Graph view** — project-level dependency tree
3. Wire to the new API endpoints

### Step 7: Required tests

**Backend:**

- `test_create_dependency`
- `test_prevent_circular_dependency`
- `test_get_dependency_graph`
- `test_unblock_task`

**Frontend:**

- Dependencies render
- Blocked tasks display
- Graph updates after create

```bash
make dev-test
```

### Step 8: Definition of Done

Check every item in the spec's **Definition of Done** section before stopping.

---

## Tips for this track

- Treat the spec as the source of truth. If something is ambiguous, make a deliberate choice and document it.
- Implement one layer at a time. Do not skip migrations or tests.
- Use the code graph (if available) to trace impact across layers before editing.
- Compare your result with the **vibe coding** track in the debrief.

---

## Quick reference

| Action | Command |
| ------ | ------- |
| Start app | `make dev` |
| New migration | `make dev-migrate-create MSG="..."` |
| Apply migrations | `make dev-migrate` |
| Run tests | `make dev-test` |
| Reset database | `make dev-reset` |
