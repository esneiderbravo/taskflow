# Architecture

TaskFlow is a full-stack workshop app: **Next.js 15 + FastAPI + PostgreSQL + Alembic**.

## Request flow (backend)

```
routes.py → Controller → Manager → Model (SQLAlchemy)
                ↓
           schemas.py (Pydantic)
```

- **Routes** (`backend/app/api/routes.py`) — HTTP only. Wire `Depends(get_db)` to controller factories.
- **Controllers** (`backend/app/api/controllers/`) — Map HTTP to manager calls. Return `*Read` via `model_validate`.
- **Managers** (`backend/app/managers/`) — Business logic + DB access. Raise `HTTPException` here.
- **Models** (`backend/app/models/`) — SQLAlchemy 2.0 declarative (`Mapped`, `mapped_column`).
- **Schemas** (`backend/app/schemas.py`) — Single file: `*Create`, `*Read`, `*Update` per entity.

**Never** put business logic in routes or controllers. **Never** query the DB from controllers.

## UI flow (frontend)

```
app/page.tsx or app/projects/[id]/page.tsx
        ↓
   hooks/ (useProjects, useTasks)
        ↓
   lib/api.ts → FastAPI
        ↓
   components/ (feature + ui/)
```

- Client components use `"use client"` where state/effects are needed.
- No global state library — hooks + local state.
- Types in `lib/api.ts` mirror backend `*Read` schemas.

## Layer ownership for new features

| Concern | Owner |
| ------- | ----- |
| HTTP paths, status codes | `routes.py` |
| Request/response mapping | Controller |
| Validation, cycles, blocked state | Manager |
| Tables, relationships | Model + migration |
| API types (TS) | `lib/api.ts` |
| UI sections | `components/` + pages |

## Implementation order

1. Model
2. Alembic migration (autogenerate — see `migrations.md`)
3. Pydantic schemas
4. Manager
5. Controller
6. Routes
7. `lib/api.ts` + hooks
8. Components + pages
9. Backend tests, then frontend tests
