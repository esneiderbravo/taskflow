from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models import TaskStatus


class ProjectCreate(BaseModel):
    name: str


class ProjectRead(BaseModel):
    id: UUID
    name: str
    created_at: datetime


class ProjectUpdate(BaseModel):
    name: str


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO


class TaskRead(BaseModel):
    id: UUID
    title: str
    description: str | None
    status: TaskStatus
    project_id: UUID
    created_at: datetime


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
