"""Business logic and database access for projects."""

from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models import Project, Task
from app.schemas import ProjectCreate, ProjectUpdate


class ProjectManager:
    """Handle project persistence and validation rules."""

    def __init__(self, db: Session) -> None:
        """Initialize the manager with an active database session.

        Args:
            db: SQLAlchemy session used for all operations.
        """
        self.db = db

    def list_all(self) -> list[Project]:
        """Return all projects ordered by creation date.

        Returns:
            list[Project]: Projects stored in the database.
        """
        return list(self.db.scalars(select(Project).order_by(Project.created_at)).all())

    def get_by_id(self, project_id: UUID) -> Project | None:
        """Return a project by ID.

        Args:
            project_id: Project primary key.

        Returns:
            Project | None: Matching project, or None if not found.
        """
        return self.db.get(Project, project_id)

    def get_or_404(self, project_id: UUID) -> Project:
        """Return a project by ID or raise HTTP 404.

        Args:
            project_id: Project primary key.

        Returns:
            Project: Matching project.

        Raises:
            HTTPException: If the project does not exist.
        """
        project = self.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    def create(self, data: ProjectCreate) -> Project:
        """Create and persist a new project.

        Args:
            data: Validated project creation payload.

        Returns:
            Project: Newly created project.

        Raises:
            HTTPException: If the project name is empty.
        """
        name = data.name.strip()
        if not name:
            raise HTTPException(status_code=422, detail="Project name is required")

        project = Project(name=name)
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update(self, project_id: UUID, data: ProjectUpdate) -> Project:
        """Update an existing project.

        Args:
            project_id: Project primary key.
            data: Validated project update payload.

        Returns:
            Project: Updated project.

        Raises:
            HTTPException: If the project is missing or the name is empty.
        """
        project = self.get_or_404(project_id)
        name = data.name.strip()
        if not name:
            raise HTTPException(status_code=422, detail="Project name is required")

        project.name = name
        self.db.commit()
        self.db.refresh(project)
        return project

    def delete(self, project_id: UUID) -> None:
        """Delete a project and all of its tasks.

        Args:
            project_id: Project primary key.

        Returns:
            None

        Raises:
            HTTPException: If the project does not exist.
        """
        project = self.get_or_404(project_id)
        self.db.execute(delete(Task).where(Task.project_id == project.id))
        self.db.delete(project)
        self.db.commit()
