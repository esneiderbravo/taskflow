"""Task ORM model."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import TaskStatus
from app.models.project import Project, utc_now


class Task(Base):
    """A unit of work belonging to a project."""

    __tablename__ = "task"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, values_callable=lambda x: [e.value for e in x], name="taskstatus"),
        default=TaskStatus.TODO,
    )
    project_id: Mapped[UUID] = mapped_column(ForeignKey("project.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    project: Mapped[Project | None] = relationship(back_populates="tasks")
