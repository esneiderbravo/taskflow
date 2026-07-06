"""HTTP controller for project endpoints."""

from uuid import UUID

from sqlalchemy.orm import Session

from app.managers import ProjectManager
from app.schemas import (
    PaginatedProjects,
    ProjectCreate,
    ProjectDetailRead,
    ProjectRead,
    ProjectSummaryRead,
    ProjectUpdate,
)


class ProjectController:
    """Translate project HTTP operations into manager calls."""

    def __init__(self, db: Session) -> None:
        """Initialize the controller with an active database session.

        Args:
            db: SQLAlchemy session passed to the project manager.
        """
        self.manager = ProjectManager(db)

    def list_projects(
        self,
        search: str | None = None,
        limit: int = 12,
        offset: int = 0,
    ) -> PaginatedProjects:
        """Return a paginated list of projects with task counts.

        Args:
            search: Optional case-insensitive name filter.
            limit: Maximum rows to return.
            offset: Number of rows to skip.

        Returns:
            PaginatedProjects: Matching projects and pagination metadata.
        """
        rows, total = self.manager.list_paginated(search=search, limit=limit, offset=offset)
        items = [
            ProjectSummaryRead(
                id=project.id,
                name=project.name,
                created_at=project.created_at,
                task_counts=counts,
            )
            for project, counts in rows
        ]
        return PaginatedProjects(
            items=items,
            total=total,
            task_total=self.manager.count_all_tasks(),
        )

    def get_project(self, project_id: UUID) -> ProjectDetailRead:
        """Return a single project with task counts.

        Args:
            project_id: Project primary key.

        Returns:
            ProjectDetailRead: Requested project with aggregated counts.

        Raises:
            HTTPException: If the project does not exist.
        """
        project = self.manager.get_or_404(project_id)
        counts = self.manager.get_task_counts(project_id)
        return ProjectDetailRead(
            id=project.id,
            name=project.name,
            created_at=project.created_at,
            task_counts=counts,
        )

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
