"""Project ORM model."""

from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


def utc_now() -> datetime:
    """Return the current UTC timestamp.

    Returns:
        datetime: Timezone-aware UTC datetime.
    """
    return datetime.now(timezone.utc)


class Project(Base):
    """A project that groups related tasks."""

    __tablename__ = "project"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    tasks: Mapped[list["Task"]] = relationship(back_populates="project")
