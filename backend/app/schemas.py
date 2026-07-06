"""Pydantic request and response schemas for the REST API."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models import TaskStatus


class ProjectCreate(BaseModel):
    """Payload for creating a project."""

    name: str


class TaskCounts(BaseModel):
    """Task totals grouped by workflow status."""

    todo: int = 0
    in_progress: int = 0
    done: int = 0


class ProjectRead(BaseModel):
    """Project representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    created_at: datetime


class ProjectSummaryRead(ProjectRead):
    """Project with aggregated task counts."""

    task_counts: TaskCounts


class ProjectDetailRead(ProjectRead):
    """Project detail with aggregated task counts."""

    task_counts: TaskCounts


class PaginatedProjects(BaseModel):
    """Paginated project list with global task total."""

    items: list[ProjectSummaryRead]
    total: int
    task_total: int


class ProjectUpdate(BaseModel):
    """Payload for updating a project."""

    name: str


class TaskCreate(BaseModel):
    """Payload for creating a task."""

    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO


class TaskRead(BaseModel):
    """Task representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str | None
    status: TaskStatus
    project_id: UUID
    created_at: datetime


class PaginatedTasks(BaseModel):
    """Paginated task list."""

    items: list[TaskRead]
    total: int


class TaskUpdate(BaseModel):
    """Payload for updating a task."""

    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
