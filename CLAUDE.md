# CLAUDE.md

Instructions for Claude (and compatible agents) working in TaskFlow.

**Read [AGENTS.md](AGENTS.md) first** — it contains the full rules. This file highlights what matters most during implementation.

## Before any code change

1. Read `openspec/constitution/*.md` (architecture, backend, frontend, migrations, API, testing)
2. If an OpenSpec change exists, read `openspec/changes/<name>/tasks.md` and follow checkboxes in order
3. Use CodeGraph to explore impact: `codegraph explore <query>`

## Migrations

Never create migration files by hand. Always:

```bash
# 1. Edit models
# 2. Generate
make dev-migrate-create MSG="add task dependencies"
# 3. Review backend/alembic/versions/<new_file>.py
# 4. Apply
make dev-migrate
```

## Layer rules

| Layer | Does | Does not |
| ----- | ---- | -------- |
| `routes.py` | HTTP wiring | Business logic |
| Controller | ORM → Pydantic | DB queries, validation |
| Manager | Logic + DB | HTTP concerns |
| Model | Schema definition | API shapes |

## Quick commands

```bash
make dev              # Start (macOS/Linux)
make dev-test         # Run all tests
make dev-migrate-create MSG="..."  # New migration
make dev-migrate      # Apply migrations
```

Windows: `.\scripts\dev-local.ps1` — see [guide/local-development.md](guide/local-development.md).

## SDD commands

```
/opsx:propose <change-name>
/opsx:apply
/opsx:archive
```

Attach `guide/user-story-task-dependencies.md` when proposing.

## Full reference

→ [AGENTS.md](AGENTS.md)
