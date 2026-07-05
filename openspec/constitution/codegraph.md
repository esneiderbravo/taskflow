# CodeGraph — mandatory first step

Agents **must** use CodeGraph before exploring the codebase. This reduces token usage and improves accuracy.

## Rule

**CodeGraph first. No self-directed search.**

Before reading files, running grep, or using codebase search:

1. Use CodeGraph MCP tools or CLI
2. Only open files CodeGraph identifies as relevant
3. Do not broad-scan the repository on your own

## Setup (once per machine)

```bash
npm install -g @colbymchenry/codegraph
codegraph init          # in project root — creates .codegraph/
```

Reload Cursor after `.cursor/mcp.json` is present (**Settings → MCP**).

## MCP tools (preferred in Cursor)

| Tool | Use when |
| ---- | -------- |
| `codegraph_explore` | Starting any task — find relevant symbols and call paths |
| `codegraph_node` | Need source + callers/callees for one symbol or file |
| `codegraph_context` | Building context for a feature or bug |

## CLI equivalents

```bash
codegraph explore task dependencies
codegraph explore ProjectManager
codegraph node TaskManager
codegraph node backend/app/api/routes.py
codegraph callers create_task
codegraph impact Task
```

## Workflow order

```
1. codegraph explore "<feature or area>"
2. codegraph node "<symbol>" (for each file to edit)
3. Read ONLY the files CodeGraph returned
4. Implement following constitution + tasks.md
5. codegraph sync (after significant edits)
```

## Do not

- Run `grep`, `rg`, or semantic search across the repo before CodeGraph
- Read `backend/app/` or `frontend/` directory-by-directory to "understand structure"
- Load large files without CodeGraph pointing to them
- Skip CodeGraph because "you already know" the codebase

## When CodeGraph is not enough

Only after CodeGraph exploration, you may:

- Read a specific file CodeGraph identified
- Read `openspec/constitution/*.md` and `openspec/changes/*/tasks.md` (standards, not code discovery)
- Read the feature spec `guide/user-story-task-dependencies.md`

## Token discipline

- One `explore` query per area — refine the query instead of re-searching
- Use `node` for targeted source instead of reading whole directories
- Batch related symbols in a single explore query when possible
