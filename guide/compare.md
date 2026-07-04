# Compare tracks

After you finish and **commit** your changes, compare what each track built.

## 1. Commit your work

```bash
git add -A
git status
git commit -m "Implement task dependencies"
```

## 2. Diff checker

**Summary** — files changed between tracks:

```bash
git diff workshop/vibe-coding...workshop/sdd --stat
```

**Full diff** — every line changed:

```bash
git diff workshop/vibe-coding...workshop/sdd
```

**One file:**

```bash
git diff workshop/vibe-coding...workshop/sdd -- path/to/file
```

**Changes since `main`** (per track):

```bash
git diff main...workshop/vibe-coding --stat
git diff main...workshop/sdd --stat
```

## 3. Debrief

Discuss with the group:

- What did vibe coding miss or guess wrong?
- What did SDD get right from the spec?
- Which tests, edge cases, or UI details differ?
