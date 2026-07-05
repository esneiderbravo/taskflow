---
name: /enrich-story
id: enrich-story
category: Workshop
description: Enrich minimal user story into full spec using CodeGraph and constitution
---

Enrich the minimal user story into a complete workshop specification.

**Input:** `guide/user-story-task-dependencies.md` (minimal)  
**Output:** `guide/user-story-enriched.md` (generated locally)

When done, attach the enriched file to `/opsx:propose task-dependencies`.

---

## Skill

Follow the **enrich-user-story** skill (`.cursor/skills/enrich-user-story/SKILL.md`) exactly.

## Quick steps

1. **CodeGraph first** — `codegraph explore task dependencies` (+ node for routes, api.ts, projects page)
2. **Read** minimal story + `guide/templates/user-story-enriched.template.md` + `openspec/constitution/*`
3. **Write** `guide/user-story-enriched.md` — all sections from template, aligned with codebase
4. **Do not read** `guide/reference/` (facilitator only)

## Mandatory in output

- Scope table with layer paths
- FR-1 to FR-4 (Given/When/Then)
- 4 API endpoints, no `/api` prefix, 422 for business rules
- Frontend on `/projects/{id}`, graph view
- 4 backend + 3 frontend tests named
- Definition of Done with migration commands

## Next

```
/opsx:propose task-dependencies
```

Attach `guide/user-story-enriched.md`.
