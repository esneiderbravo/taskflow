# User Story: Task Dependencies

## Story

**As a** project member  
**I want** tasks to depend on other tasks  
**So that** work happens in the right order

## Description

Some tasks cannot start until others are finished.

Example:

```
Setup Database → Implement API → Build Frontend → Deploy
```

The app should understand these relationships.

## Acceptance Criteria

- [ ] A user can link one task to another (B depends on A)
- [ ] Circular dependencies are not allowed
- [ ] The UI shows which tasks are blocked
- [ ] There is a graph view for a project
- [ ] API endpoints exist for dependencies

## Notes

Add a `TaskDependency` table with `parent_task_id` and `child_task_id`.

Show blocked tasks in red on the task page.
