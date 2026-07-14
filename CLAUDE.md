# CLAUDE.md

Instructions for Claude (and compatible agents) working in TaskFlow.

**Read [AGENTS.md](AGENTS.md) first** — it contains the full rules.

## Mandatory: CodeGraph before anything else

**Do not search the codebase on your own.** No grep, no semantic search, no directory scanning.

```
1. codegraph explore "<feature area>"     # or MCP codegraph_explore
2. codegraph node "<symbol or file>"      # for each edit target
3. Read ONLY files CodeGraph returned
```

This is required to save tokens and get accurate call paths. See [codegraph.md](openspec/constitution/codegraph.md).

## Before any code change

1. **CodeGraph explore** — map symbols and impact
2. Read `openspec/constitution/*.md` (standards only — not code discovery)
3. If an OpenSpec change exists, read `openspec/changes/<name>/tasks.md`

## Migrations

Never create migration files by hand. Always:

```bash
make migrate-create MSG="add task dependencies"
make migrate
make up
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
make up               # Start / rebuild stack
make logs             # Follow logs after rebuild
make test             # Run all tests in containers
make migrate          # Apply migrations
make reset            # Wipe DB volumes + rebuild
codegraph explore <query>   # BEFORE reading code
codegraph sync        # After edits
```

After code changes: `make up && make logs`. See [guide/docker.md](guide/docker.md).

## SDD commands

```
/enrich-story
/opsx:propose <change-name>
/opsx:apply
/opsx:archive
```

Attach `guide/user-story-enriched.md` when proposing (run `/enrich-story` first).

## Full reference

→ [AGENTS.md](AGENTS.md)
