# SDD Workshop

Full step-by-step: **[sdd-walkthrough.md](./sdd-walkthrough.md)** (clone → enrich → propose → apply → archive → compare)

[OpenSpec](https://github.com/Fission-AI/OpenSpec) · Spec: [user-story-task-dependencies.md](./user-story-task-dependencies.md)

## Tooling

OpenSpec and constitution are pre-configured — no `openspec init` needed.

| Tool | Purpose |
| ---- | ------- |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | Proposal, specs, design, tasks |
| CodeGraph | Explore codebase before any search |
| `ai-agents/` | Shared skills, commands, prompts ([README](../ai-agents/README.md)) |
| `openspec/constitution/` | Project standards injected into every change |
| [AGENTS.md](../AGENTS.md) | Rules agents follow when implementing |

Install once (from the repo root):

```bash
npm install
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

`npm install` installs workshop dependencies (`ui-ux-pro-max-cli`) for the design skills in `ai-agents/skills/`.

Reload Cursor MCP after `codegraph init` (**Settings → MCP**). Config: `ai-agents/mcp.json`.

## Workflow summary

```
/enrich-story
    ↓
/opsx:propose task-dependencies   (attach guide/user-story-enriched.md)
    ↓
/opsx:apply
    ↓
make dev-test
    ↓
/opsx:archive
    ↓
compare.md
```

Optional: `/opsx:explore` before proposing.

## Compare

Commit locally, then [compare.md](./compare.md) — diff against `workshop/vibe-coding`.
