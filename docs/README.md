# Workshop specs

Two tracks for the **Task Dependencies** feature. Same codebase, different level of specification.

| Track | Branch | Spec file | Content |
| ----- | ------ | --------- | ------- |
| Vibe coding | `workshop/vibe-coding` | `docs/user-story-task-dependencies.md` | Simple (minimal) |
| Spec-driven (SDD) | `workshop/sdd` | `docs/user-story-task-dependencies.md` | Enriched (full spec) |

Both branches use the same filename. The **content** differs by track.

Reference templates (on `main`):

- [user-story-simple.md](./user-story-simple.md) — vibe coding source
- [user-story-enriched.md](./user-story-enriched.md) — SDD source

## Checkout a track

```bash
# Vibe coding
git checkout workshop/vibe-coding
# Read docs/user-story-task-dependencies.md

# Spec-driven development
git checkout workshop/sdd
# Read docs/user-story-task-dependencies.md
```

Implement the feature on your branch. Compare results with the other track in the debrief.
