"""Pydantic request and response schemas for the REST API."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models import TaskStatus


class ProjectCreate(BaseModel):
    """Payload for creating a project."""

    name: str


class ProjectRead(BaseModel):
    """Project representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    created_at: datetime


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


class TaskUpdate(BaseModel):
    """Payload for updating a task."""

    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
