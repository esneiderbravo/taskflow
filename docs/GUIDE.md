# 📘 SDD Workshop

[OpenSpec](https://github.com/Fission-AI/OpenSpec) · Spec: [user-story-task-dependencies.md](./user-story-task-dependencies.md)

## Setup

```bash
git checkout workshop/sdd
make dev
npm install -g @fission-ai/openspec@latest
openspec init
```

## Workflow

Attach `docs/user-story-task-dependencies.md` in each step.

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
