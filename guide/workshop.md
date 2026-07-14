# Vibe Coding Workshop

Full step-by-step: **[vibe-coding-walkthrough.md](./vibe-coding-walkthrough.md)** (clone → one prompt → implement → compare)

Spec: [user-story-task-dependencies.md](./user-story-task-dependencies.md)

## Quick start

**Only requirement:** Docker running. See [docker.md](./docker.md).

**macOS / Linux**

```bash
git checkout workshop/vibe-coding
make up
```

**Windows (PowerShell)**

```powershell
git checkout workshop/vibe-coding
docker compose up --build -d
```

After code changes: `make up && make logs` (rebuild — not hot reload).

## Workflow

Attach `guide/user-story-task-dependencies.md`, then:

```
Implement the feature described in guide/user-story-task-dependencies.md.
```

See [vibe-coding-walkthrough.md](./vibe-coding-walkthrough.md) for the full sequence including tests and compare.

## Compare

Commit locally, then [compare.md](./compare.md) — diff against `workshop/sdd`.
