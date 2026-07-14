# Workshop

Two tracks implement **Task Dependencies** from the same codebase with different specs.

| Track | Branch | Spec |
| ----- | ------ | ---- |
| Vibe coding | `workshop/vibe-coding` | Minimal user story |
| Spec-driven (SDD) | `workshop/sdd` | Full spec |

## Start

**Only requirement:** Docker running. Full stack in containers — see [docker.md](./docker.md).

**macOS / Linux**

```bash
make down
git checkout workshop/vibe-coding   # or workshop/sdd
make reset
```

**Windows (PowerShell)**

```powershell
docker compose down
git checkout workshop/vibe-coding   # or workshop/sdd
docker compose down -v
docker compose up --build -d
```

Open `guide/README.md` on the branch you checked out for the track-specific workflow.

After code changes: `make up && make logs` (rebuild — not hot reload).

After both tracks commit their work, compare results: [compare.md](./compare.md).
