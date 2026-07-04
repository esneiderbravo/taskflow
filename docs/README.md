# Workshop specs

Two tracks for the **Task Dependencies** feature. Same codebase, different level of specification.

| Track | Branch | Spec file | Approach |
| ----- | ------ | --------- | -------- |
| Vibe coding | `workshop/vibe-coding` | [user-story.md](./user-story.md) | Minimal story, figure out details while coding |
| Spec-driven (SDD) | `workshop/sdd` | [user-story.md](./user-story.md) | Full spec before implementation |

Reference copies (on `main`):

- [user-story-simple.md](./user-story-simple.md) — vibe coding template
- [user-story-enriched.md](./user-story-enriched.md) — SDD template

## Checkout a track

```bash
# Vibe coding
git checkout workshop/vibe-coding

# Spec-driven development
git checkout workshop/sdd
```

Implement the feature on your branch. Compare results with the other track in the debrief.
