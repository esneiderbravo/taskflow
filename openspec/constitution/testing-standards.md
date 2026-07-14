# Testing standards

## Backend — pytest

**Location:** `backend/app/tests/`

**Run:**

```bash
make test                                          # backend + frontend in containers
docker compose exec backend pytest -v              # backend only
```

### Patterns

- Integration tests via `TestClient` against real PostgreSQL
- `DATABASE_URL` set in `conftest.py` (defaults to local Docker DB)
- `client` fixture in `test_api.py` overrides `get_db`
- `autouse` fixture truncates tables before each test (`TRUNCATE ... RESTART IDENTITY CASCADE`)
- One test file per feature area: `test_api.py`, `test_dependencies.py`

### Naming

```python
def test_create_dependency(client):
def test_prevent_circular_dependency(client):
def test_get_dependency_graph(client):
```

### What to test

- CRUD happy paths
- `404` for missing resources
- `422` for business rule violations
- Side effects (cascade delete, blocked state)

## Frontend — Vitest

**Location:** `frontend/tests/`

**Run:**

```bash
docker compose exec frontend npm test -- --run
# or: make test
```

### Patterns

- `@testing-library/react` + `vitest`
- Test components in isolation (render + assert text/roles)
- Setup in `frontend/tests/setup.ts`

### What to test

- UI renders expected content
- Blocked/ready states display correctly
- User-visible behavior after actions (not implementation details)

## OpenSpec tasks

Every feature must end with:

- [ ] `make test` passes (or Windows `docker compose exec` equivalents)
- [ ] New backend tests for each FR with API impact
- [ ] New frontend tests for each UI requirement in the spec
