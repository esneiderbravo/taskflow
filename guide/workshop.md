# SDD Workshop

[OpenSpec](https://github.com/Fission-AI/OpenSpec) · Spec: [user-story-task-dependencies.md](./user-story-task-dependencies.md)

## Setup

**macOS / Linux**

```bash
git checkout workshop/sdd
make dev
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

**Windows (PowerShell)**

```powershell
git checkout workshop/sdd
.\scripts\dev-local.ps1
npm install -g @fission-ai/openspec@latest
npm install -g @colbymchenry/codegraph
codegraph init
```

OpenSpec and constitution are pre-configured in the repo — no `openspec init` needed.

### CodeGraph MCP

**Mandatory:** agents must use CodeGraph before exploring code — no grep or self-directed search.

The repo includes `.mcp.json` and `.cursor/mcp.json` for CodeGraph. After `codegraph init`, reload Cursor (**Settings → MCP**).

Requires the `codegraph` CLI on your PATH. Do not commit `.codegraph/` — it is gitignored and rebuilt locally.

### Constitution

Project standards for AI agents live in `openspec/constitution/` and are injected into every OpenSpec change. Read `AGENTS.md` before implementing.

## Workflow

Same minimal story as vibe coding — you enrich it as the first SDD step.

### 1. Enrich the story

```
/enrich-story
```

Generates `guide/user-story-enriched.md` from the minimal story, CodeGraph, constitution, and the **enrich-user-story** skill.

| IDE | Skill path |
| --- | ---------- |
| Cursor | `.cursor/skills/enrich-user-story/SKILL.md` |
| Claude Code | `.claude/skills/enrich-user-story/SKILL.md` |
| Codex | `.codex/skills/enrich-user-story/SKILL.md` |
| Factory | `.factory/skills/enrich-user-story/SKILL.md` |
| GitHub Copilot | `.github/skills/enrich-user-story/SKILL.md` |

### 2. Propose the change

Attach `guide/user-story-enriched.md`:

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

In debrief, compare your implementation against `workshop/vibe-coding` and review whether your enriched spec covered all layers.
