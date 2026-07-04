from datetime import datetime, timezone
from enum import Enum
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Project(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=200)
    created_at: datetime = Field(default_factory=utc_now)

    tasks: list["Task"] = Relationship(back_populates="project")


class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus = Field(default=TaskStatus.TODO)
    project_id: UUID = Field(foreign_key="project.id")
    created_at: datetime = Field(default_factory=utc_now)

    project: Project | None = Relationship(back_populates="tasks")
