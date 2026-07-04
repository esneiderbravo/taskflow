# ⚡ Workshop Guide: Vibe Coding

This track builds **Task Dependencies** from a short user story only. No detailed specification — requirements emerge as you build.

**User story:** [user-story-task-dependencies.md](./user-story-task-dependencies.md)

---

## 🚀 Before you start

```bash
git checkout workshop/vibe-coding
make dev    # recommended: hot reload
# or
make up     # full Docker
```

Open the application at [http://localhost:3000](http://localhost:3000).

---

## 🎯 Your only instruction

Read [user-story-task-dependencies.md](./user-story-task-dependencies.md), then paste this prompt into your AI assistant:

```
Implement the feature described in docs/user-story-task-dependencies.md.
```

That is the entire brief. No specification beyond the user story.

---

## 💭 What vibe coding means here

- ⚡ Move fast from a minimal story to working code
- 🤖 Let the AI infer details, edge cases, and structure
- 🔧 Refine and fix as issues surface
- 🚫 Do not read a detailed specification first

---

## 🔍 After you finish

Compare your outcome with the **SDD** track (`workshop/sdd`) during the debrief:

- What did the AI assume that a full spec would have clarified?
- What was missing or incorrect (cycles, blocked state, graph view)?
- How much time went to debugging vs initial delivery?

---

## 📦 Quick reference

| Action | Command |
| ------ | ------- |
| 🚀 Start app | `make dev` |
| 📝 New migration | `make dev-migrate-create MSG="..."` |
| 📜 Apply migrations | `make dev-migrate` |
| 🧪 Run tests | `make dev-test` |
| 🔄 Reset database | `make dev-reset` |
