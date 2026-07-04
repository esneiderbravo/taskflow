# Workshop Prompt — Task Dependencies Feature

Use this **exact same prompt** in both workshop parts for a fair comparison.

## Part 1 — Vibe Coding (`workshop/bare` branch)

Paste directly in your AI assistant chat:

```
Add task dependencies to the application.

Users should be able to define that one task depends on another.
The system must prevent circular dependencies.
Tasks that have incomplete dependencies should show as blocked.
Add API endpoints and update the frontend to show dependencies and a graph view.
Add tests.
```

## Part 2 — Spec-Driven Development (`workshop/sdd` branch)

Same intent, structured workflow:

```
/opsx:propose add-task-dependencies
```

Review the generated artifacts (`proposal.md`, `specs/`, `design.md`, `tasks.md`) with the group, then:

```
/opsx:apply
```

Optional reinforcement after `/opsx:apply`:

```
Implement add-task-dependencies according to the specification.
Use CodeGraph to understand the existing architecture before making changes.
Follow the patterns in repositories/ and services/ layers.
Ensure all scenarios in the delta specs have corresponding tests.
```

## Expected Feature Scope

| Area | Requirement |
|------|-------------|
| **Entity** | `TaskDependency(id, parent_task_id, child_task_id, created_at)` |
| **Business rule** | Task B depends on Task A → B is blocked until A is done |
| **Validation** | Reject circular dependencies (A→B→C→A) |
| **API** | `POST/DELETE/GET /tasks/{id}/dependencies`, `GET /projects/{id}/graph` |
| **Frontend** | Depends On / Blocking sections, blocked status indicator, graph view |
| **Tests** | Backend: create, cycle prevention, graph, unblock. Frontend: render, blocked state |
