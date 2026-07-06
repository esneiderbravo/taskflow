"""Business logic and database access for tasks."""

from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.managers.project_manager import ProjectManager
from app.models import Task, TaskStatus
from app.schemas import TaskCreate, TaskUpdate


class TaskManager:
    """Handle task persistence and validation rules."""

    def __init__(self, db: Session) -> None:
        """Initialize the manager with an active database session.

        Args:
            db: SQLAlchemy session used for all operations.
        """
        self.db = db
        self.project_manager = ProjectManager(db)

    def list_by_project(
        self,
        project_id: UUID,
        search: str | None = None,
        status: TaskStatus | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Task], int]:
        """Return a paginated slice of tasks for a project.

        Args:
            project_id: Parent project primary key.
            search: Optional case-insensitive title/description filter.
            status: Optional workflow status filter.
            limit: Maximum rows to return.
            offset: Number of rows to skip.

        Returns:
            tuple[list[Task], int]: Page of tasks and the total number of matches.

        Raises:
            HTTPException: If the parent project does not exist.
        """
        self.project_manager.get_or_404(project_id)
        filters = [Task.project_id == project_id]
        if status is not None:
            filters.append(Task.status == status)
        if search and search.strip():
            term = f"%{search.strip()}%"
            filters.append(or_(Task.title.ilike(term), Task.description.ilike(term)))

        total = self.db.scalar(select(func.count()).select_from(Task).where(*filters)) or 0
        tasks = list(
            self.db.scalars(
                select(Task)
                .where(*filters)
                .order_by(Task.created_at.desc())
                .limit(limit)
                .offset(offset)
            ).all()
        )
        return tasks, int(total)

    def get_by_id(self, task_id: UUID) -> Task | None:
        """Return a task by ID.

        Args:
            task_id: Task primary key.

        Returns:
            Task | None: Matching task, or None if not found.
        """
        return self.db.get(Task, task_id)

    def get_or_404(self, task_id: UUID) -> Task:
        """Return a task by ID or raise HTTP 404.

        Args:
            task_id: Task primary key.

        Returns:
            Task: Matching task.

        Raises:
            HTTPException: If the task does not exist.
        """
        task = self.get_by_id(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    def create(self, project_id: UUID, data: TaskCreate) -> Task:
        """Create and persist a new task.

        Args:
            project_id: Parent project primary key.
            data: Validated task creation payload.

        Returns:
            Task: Newly created task.

        Raises:
            HTTPException: If the project is missing or the title is empty.
        """
        self.project_manager.get_or_404(project_id)
        title = data.title.strip()
        if not title:
            raise HTTPException(status_code=422, detail="Task title is required")

        task = Task(
            title=title,
            description=data.description,
            status=data.status or TaskStatus.TODO,
            project_id=project_id,
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, task_id: UUID, data: TaskUpdate) -> Task:
        """Update an existing task.

        Args:
            task_id: Task primary key.
            data: Validated task update payload.

        Returns:
            Task: Updated task.

        Raises:
            HTTPException: If the task is missing or the title is empty.
        """
        task = self.get_or_404(task_id)
        fields = data.model_dump(exclude_unset=True)

        if "title" in fields and fields["title"] is not None:
            fields["title"] = fields["title"].strip()
            if not fields["title"]:
                raise HTTPException(status_code=422, detail="Task title is required")

        for key, value in fields.items():
            setattr(task, key, value)

        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, task_id: UUID) -> None:
        """Delete a task.

        Args:
            task_id: Task primary key.

        Returns:
            None

        Raises:
            HTTPException: If the task does not exist.
        """
        task = self.get_or_404(task_id)
        self.db.delete(task)
        self.db.commit()
