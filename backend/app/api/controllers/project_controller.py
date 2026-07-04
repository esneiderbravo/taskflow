"""HTTP controller for project endpoints."""

from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.managers import ProjectManager
from app.schemas import ProjectCreate, ProjectRead, ProjectUpdate


class ProjectController:
    """Translate project HTTP operations into manager calls."""

    def __init__(self, db: Session) -> None:
        """Initialize the controller with an active database session.

        Args:
            db: SQLAlchemy session passed to the project manager.
        """
        self.manager = ProjectManager(db)

    def list_projects(self) -> list[ProjectRead]:
        """Return all projects as API response models.

        Returns:
            list[ProjectRead]: Every project in the database.
        """
        return [ProjectRead.model_validate(p) for p in self.manager.list_all()]

    def get_project(self, project_id: UUID) -> ProjectRead:
        """Return a single project as an API response model.

        Args:
            project_id: Project primary key.

        Returns:
            ProjectRead: Requested project.

        Raises:
            HTTPException: If the project does not exist.
        """
        return ProjectRead.model_validate(self.manager.get_or_404(project_id))

    def create_project(self, data: ProjectCreate) -> ProjectRead:
        """Create a project and return the API response model.

        Args:
            data: Validated project creation payload.

        Returns:
            ProjectRead: Newly created project.

        Raises:
            HTTPException: If the project name is empty.
        """
        return ProjectRead.model_validate(self.manager.create(data))

    def update_project(self, project_id: UUID, data: ProjectUpdate) -> ProjectRead:
        """Update a project and return the API response model.

        Args:
            project_id: Project primary key.
            data: Validated project update payload.

        Returns:
            ProjectRead: Updated project.

        Raises:
            HTTPException: If the project is missing or the name is empty.
        """
        return ProjectRead.model_validate(self.manager.update(project_id, data))

    def delete_project(self, project_id: UUID) -> None:
        """Delete a project and its tasks.

        Args:
            project_id: Project primary key.

        Returns:
            None

        Raises:
            HTTPException: If the project does not exist.
        """
        self.manager.delete(project_id)
