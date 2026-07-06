"""Business logic and database access for projects."""

from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import case, delete, func, select
from sqlalchemy.orm import Session

from app.models import Project, Task, TaskStatus
from app.schemas import ProjectCreate, ProjectUpdate, TaskCounts


class ProjectManager:
    """Handle project persistence and validation rules."""

    def __init__(self, db: Session) -> None:
        """Initialize the manager with an active database session.

        Args:
            db: SQLAlchemy session used for all operations.
        """
        self.db = db

    def _task_count_columns(self) -> tuple:
        """Build SQL expressions for task counts grouped by status.

        Returns:
            tuple: todo, in_progress, and done count expressions.
        """
        return (
            func.coalesce(
                func.sum(case((Task.status == TaskStatus.TODO, 1), else_=0)),
                0,
            ).label("todo"),
            func.coalesce(
                func.sum(case((Task.status == TaskStatus.IN_PROGRESS, 1), else_=0)),
                0,
            ).label("in_progress"),
            func.coalesce(
                func.sum(case((Task.status == TaskStatus.DONE, 1), else_=0)),
                0,
            ).label("done"),
        )

    def list_all(self) -> list[Project]:
        """Return all projects ordered by creation date.

        Returns:
            list[Project]: Projects stored in the database.
        """
        return list(self.db.scalars(select(Project).order_by(Project.created_at.desc())).all())

    def list_paginated(
        self,
        search: str | None = None,
        limit: int = 12,
        offset: int = 0,
    ) -> tuple[list[tuple[Project, TaskCounts]], int]:
        """Return a paginated slice of projects with task counts.

        Args:
            search: Optional case-insensitive name filter.
            limit: Maximum rows to return.
            offset: Number of rows to skip.

        Returns:
            tuple[list[tuple[Project, TaskCounts]], int]: Page of projects with counts
                and the total number of matching projects.
        """
        filters = []
        if search and search.strip():
            filters.append(Project.name.ilike(f"%{search.strip()}%"))

        total = self.db.scalar(
            select(func.count()).select_from(Project).where(*filters)
        ) or 0

        todo_expr, in_progress_expr, done_expr = self._task_count_columns()
        stmt = (
            select(Project, todo_expr, in_progress_expr, done_expr)
            .outerjoin(Task, Task.project_id == Project.id)
            .where(*filters)
            .group_by(Project.id)
            .order_by(Project.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        rows = self.db.execute(stmt).all()
        items = [
            (
                project,
                TaskCounts(
                    todo=int(todo or 0),
                    in_progress=int(in_progress or 0),
                    done=int(done or 0),
                ),
            )
            for project, todo, in_progress, done in rows
        ]
        return items, int(total)

    def count_all_tasks(self) -> int:
        """Return the total number of tasks across all projects.

        Returns:
            int: Global task count.
        """
        return int(self.db.scalar(select(func.count()).select_from(Task)) or 0)

    def get_task_counts(self, project_id: UUID) -> TaskCounts:
        """Return task counts for a single project.

        Args:
            project_id: Project primary key.

        Returns:
            TaskCounts: Aggregated counts for the project.

        Raises:
            HTTPException: If the project does not exist.
        """
        self.get_or_404(project_id)
        todo_expr, in_progress_expr, done_expr = self._task_count_columns()
        row = self.db.execute(
            select(todo_expr, in_progress_expr, done_expr)
            .select_from(Task)
            .where(Task.project_id == project_id)
        ).one()
        return TaskCounts(
            todo=int(row.todo or 0),
            in_progress=int(row.in_progress or 0),
            done=int(row.done or 0),
        )

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
