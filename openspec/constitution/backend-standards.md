# Backend standards

Python 3.12 · FastAPI · SQLAlchemy 2.0 · runs in Docker (`backend` service)

## File layout

| Artifact | Path pattern |
| -------- | ------------ |
| Model | `backend/app/models/{entity}.py` |
| Manager | `backend/app/managers/{entity}_manager.py` |
| Controller | `backend/app/api/controllers/{entity}_controller.py` |
| Schemas | `backend/app/schemas.py` (append, do not split) |
| Routes | `backend/app/api/routes.py` (append endpoints) |
| Tests | `backend/app/tests/test_{feature}.py` |

Export new models from `backend/app/models/__init__.py` and managers from `backend/app/managers/__init__.py`.

## Naming

- Classes: `ProjectManager`, `TaskDependencyManager`
- Manager methods: `list_all`, `get_by_id`, `get_or_404`, `create`, `update`, `delete`
- Tables: singular lowercase (`project`, `task`, `task_dependency`)
- Primary keys: UUID (`uuid4` default)
- Timestamps: `created_at` with `DateTime(timezone=True)`, UTC via `utc_now`
- Enums: `str, Enum` in `backend/app/models/enums.py`, lowercase snake values

## Managers

- Accept `Session` in `__init__`
- Use `select()` / `self.db.get()` — no raw SQL unless justified in design
- Raise `HTTPException` for domain errors:
  - `404` — resource not found
  - `422` — validation / business rule violation (cycles, self-links, cross-project)
  - `400` — malformed request (when applicable)
- Commit via `self.db.commit()` and `self.db.refresh()` after creates/updates
- Use `self.db.flush()` when you need generated IDs before commit

## Controllers

- Thin — delegate to manager, map ORM → Pydantic
- Pattern: `EntityRead.model_validate(orm_obj)`
- Re-raise manager `HTTPException`; do not add business rules here

## Routes

- Use `APIRouter` handlers with `response_model` and correct status codes (`201` create, `204` delete)
- Factory helpers: `{entity}_controller(db: Session = Depends(get_db))`
- Google-style docstrings on every public function (`Args`, `Returns`, `Raises`)

## Docstrings

Google style on all public classes and methods:

```python
def get_or_404(self, task_id: UUID) -> Task:
    """Return a task by ID or raise HTTP 404.

    Args:
        task_id: Task primary key.

    Returns:
        Task: Matching task.

    Raises:
        HTTPException: If the task does not exist.
    """
```

## Do not

- Put SQL or business rules in routes/controllers
- Create standalone scripts for seed data (use Alembic migrations)
- Add new top-level packages without updating `architecture.md`
- Use SQLite — PostgreSQL only
