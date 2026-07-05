# AI Agents

Single source of truth for agent skills, commands, and prompts. All IDEs share the same files.

## Layout

```
ai-agents/
├── skills/       # Shared skills
├── commands/
│   ├── enrich-story.md
│   └── opsx/     # /opsx:propose, /opsx:apply, ...
│       ├── propose.md
│       ├── apply.md
│       └── ...
├── prompts/      # Shared Copilot prompts
└── mcp.json      # CodeGraph MCP config
```

## IDE symlinks

IDE folders symlink directly into `ai-agents/`:

| Repo path | Target |
| --------- | ------ |
| `.cursor/skills` | `ai-agents/skills` |
| `.cursor/commands` | `ai-agents/commands` |
| `.cursor/mcp.json` | `ai-agents/mcp.json` |
| `.claude/skills` | `ai-agents/skills` |
| `.claude/commands` | `ai-agents/commands` |
| `.codex/skills` | `ai-agents/skills` |
| `.factory/skills` | `ai-agents/skills` |
| `.factory/commands` | `ai-agents/commands` |
| `.github/skills` | `ai-agents/skills` |
| `.github/prompts` | `ai-agents/prompts` |
| `.agents/skills` | `ai-agents/skills` |
| `.gemini/skills` | `ai-agents/skills` |
| `.mcp.json` | `ai-agents/mcp.json` |

Add a skill in `ai-agents/skills/` — it appears in every IDE. Create a file under `.claude/skills/` — it writes to `ai-agents/skills/` via symlink.

Edit only `ai-agents/`. Never duplicate content in IDE folders.
