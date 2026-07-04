# Workshop Guide: Vibe Coding

This track implements **Task Dependencies** with a minimal user story and no detailed spec. Discover requirements while you build.

**Story:** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

---

## Before you start

```bash
git checkout workshop/vibe-coding
make dev    # recommended: hot reload
# or
make up     # full Docker
```

Open the app at [http://localhost:3000](http://localhost:3000).

---

## Your only instruction

Read [user-story-task-dependencies.md](./user-story-task-dependencies.md), then paste this prompt into your AI assistant:

```
Implement the feature described in docs/user-story-task-dependencies.md
across the full TaskFlow stack (database, API, business logic, frontend, and tests).
```

That is it. No spec to follow beyond the user story.

---

## What vibe coding means here

- Start coding quickly from a short story
- Let the AI infer API shapes, validation rules, and edge cases
- Fix issues as they appear
- Do not read a detailed specification first

---

## After you finish

Compare with the **SDD** track (`workshop/sdd`):

- What did the AI assume that the spec would have prevented?
- What broke or was missing (cycles, blocked state, graph view, tests)?
- How long did debugging take vs planning?

---

## Quick reference

| Action | Command |
| ------ | ------- |
| Start app | `make dev` |
| New migration | `make dev-migrate-create MSG="..."` |
| Apply migrations | `make dev-migrate` |
| Run tests | `make dev-test` |
| Reset database | `make dev-reset` |
