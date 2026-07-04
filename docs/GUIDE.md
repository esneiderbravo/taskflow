# 📘 Workshop Guide: Spec-Driven Development (SDD)

This track builds **Task Dependencies** by reading the full specification first, then implementing layer by layer with clear acceptance criteria.

**Specification:** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

---

## 🚀 Before you start

```bash
git checkout workshop/sdd
make dev    # recommended: hot reload
# or
make up     # full Docker
```

Open the application at [http://localhost:3000](http://localhost:3000).

---

## 🧭 SDD workflow

### Step 1: 📖 Read the spec end-to-end

Read [user-story-task-dependencies.md](./user-story-task-dependencies.md) in full before writing any code.

Identify and be able to explain:

- 🗄️ Data model (`TaskDependency`)
- ⚖️ Business rules (no cycles, blocked vs ready)
- 🔌 API contracts (request and response shapes)
- 🖥️ Frontend requirements (task detail and graph view)
- 🧪 Required tests

Do not start implementation until each section is clear.

### Step 2: 🗺️ Map the spec to the codebase

Review the existing architecture and list the files you expect to touch:

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

### Step 3: 🗄️ Database first

1. Add the `TaskDependency` SQLAlchemy model
2. Generate and apply a migration:

```bash
make dev-migrate-create MSG="add task dependencies"
make dev-migrate
```

3. Confirm the schema before continuing

### Step 4: ⚙️ Business logic

Implement in the manager layer:

- Create dependency (same project, no self-link, no duplicates)
- **Cycle detection** before persisting
- Blocked and ready state resolution
- Delete dependency
- Fetch depends-on and blocking lists
- Build the project dependency graph

Add tests as each rule is implemented.

### Step 5: 🔌 API layer

Implement the endpoints defined in the specification:

| Method | Path |
| ------ | ---- |
| `POST` | `/tasks/{id}/dependencies` |
| `DELETE` | `/tasks/{id}/dependencies/{dependency_id}` |
| `GET` | `/tasks/{id}/dependencies` |
| `GET` | `/projects/{id}/graph` |

Return the status codes and error cases documented in the spec (`400` for cycles, `404` for missing resources).

### Step 6: 🖥️ Frontend

1. **Task detail** — Depends on / Blocking sections and status indicators
2. **Graph view** — project-level dependency visualization
3. Connect UI components to the new API endpoints

### Step 7: 🧪 Required tests

**Backend:**

- `test_create_dependency`
- `test_prevent_circular_dependency`
- `test_get_dependency_graph`
- `test_unblock_task`

**Frontend:**

- Dependencies render correctly
- Blocked tasks are displayed
- Graph updates after creating a dependency

```bash
make dev-test
```

### Step 8: ✅ Definition of Done

Verify every item in the spec's **Definition of Done** section before considering the feature complete.

---

## 💡 Tips for this track

- Treat the specification as the single source of truth
- Implement one layer at a time; avoid skipping migrations or tests
- Use the code graph (if available) to understand cross-layer impact before editing
- Compare outcomes with the **vibe coding** track during the debrief

---

## 📦 Quick reference

| Action | Command |
| ------ | ------- |
| 🚀 Start app | `make dev` |
| 📝 New migration | `make dev-migrate-create MSG="..."` |
| 📜 Apply migrations | `make dev-migrate` |
| 🧪 Run tests | `make dev-test` |
| 🔄 Reset database | `make dev-reset` |
