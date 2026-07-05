# API standards

REST API served by FastAPI at `http://localhost:8000`. Interactive docs at `/docs`.

## URL convention

**No `/api` prefix.** Routes are root-level:

| Resource | Pattern |
| -------- | ------- |
| Projects | `/projects`, `/projects/{id}` |
| Tasks (nested) | `/projects/{id}/tasks` |
| Tasks (flat) | `/tasks/{id}` |

New endpoints follow the same style. Workshop specs may mention `/api` — **follow the codebase**, not the outdated prefix.

## Status codes

| Code | When |
| ---- | ---- |
| `200` | Successful GET/PUT |
| `201` | Successful POST (create) |
| `204` | Successful DELETE |
| `400` | Bad request / invalid input |
| `404` | Resource not found |
| `422` | Business rule violation (cycles, duplicates, cross-project) |

## Request/response

- JSON bodies validated by Pydantic `*Create` / `*Update` schemas
- Responses use `*Read` schemas via `response_model`
- Error body: FastAPI default `{"detail": "..."}`

## Frontend mirror

Every new endpoint needs a matching method in `frontend/lib/api.ts`:

```typescript
// Pattern
createDependency: (taskId: string, parentTaskId: string) =>
  request<Dependency>(`/tasks/${taskId}/dependencies`, {
    method: "POST",
    body: JSON.stringify({ parent_task_id: parentTaskId }),
  }),
```

Field names: Python `snake_case` in JSON (Pydantic default).

## Testing

Each endpoint gets at least one pytest case in `backend/app/tests/`:

- Happy path
- Not found (`404`)
- Business rule rejection (`422`) when applicable
