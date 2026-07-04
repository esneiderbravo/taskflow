# SDD Workshop

[OpenSpec](https://github.com/Fission-AI/OpenSpec) · Spec: [user-story-task-dependencies.md](./user-story-task-dependencies.md)

## Setup

**macOS / Linux**

```bash
git checkout workshop/sdd
make dev
npm install -g @fission-ai/openspec@latest
openspec init
npm install -g @colbymchenry/codegraph
codegraph init
```

**Windows (PowerShell)**

```powershell
git checkout workshop/sdd
.\scripts\dev-local.ps1
npm install -g @fission-ai/openspec@latest
openspec init
npm install -g @colbymchenry/codegraph
codegraph init
```

### CodeGraph MCP

The repo includes `.mcp.json` and `.cursor/mcp.json` for CodeGraph. After `codegraph init`, reload Cursor (**Settings → MCP**).

Requires the `codegraph` CLI on your PATH. Do not commit `.codegraph/` — it is gitignored and rebuilt locally.

## Workflow

Attach `guide/user-story-task-dependencies.md` in each step.

```
/opsx:propose task-dependencies
```

Review the generated artifacts, then:

```
/opsx:apply
```

```
/opsx:archive
```

Optional: `/opsx:explore` · `/opsx:verify`

## Compare

Commit your work, then run the diff checker: [compare.md](./compare.md)
