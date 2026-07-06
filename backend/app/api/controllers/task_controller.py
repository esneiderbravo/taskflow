"""HTTP controller for task endpoints."""

from uuid import UUID

from sqlalchemy.orm import Session

from app.managers import TaskManager
from app.models import TaskStatus
from app.schemas import PaginatedTasks, TaskCreate, TaskRead, TaskUpdate


class TaskController:
    """Translate task HTTP operations into manager calls."""

    def __init__(self, db: Session) -> None:
        """Initialize the controller with an active database session.

        Args:
            db: SQLAlchemy session passed to the task manager.
        """
        self.manager = TaskManager(db)

    def list_tasks(
        self,
        project_id: UUID,
        search: str | None = None,
        status: TaskStatus | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> PaginatedTasks:
        """Return a paginated list of tasks for a project.

        Args:
            project_id: Parent project primary key.
            search: Optional case-insensitive title/description filter.
            status: Optional workflow status filter.
            limit: Maximum rows to return.
            offset: Number of rows to skip.

        Returns:
            PaginatedTasks: Matching tasks and pagination metadata.

        Raises:
            HTTPException: If the parent project does not exist.
        """
        tasks, total = self.manager.list_by_project(
            project_id,
            search=search,
            status=status,
            limit=limit,
            offset=offset,
        )
        return PaginatedTasks(
            items=[TaskRead.model_validate(task) for task in tasks],
            total=total,
        )

    def get_task(self, task_id: UUID) -> TaskRead:
        """Return a single task as an API response model.

        Args:
            task_id: Task primary key.

        Returns:
            TaskRead: Requested task.

        Raises:
            HTTPException: If the task does not exist.
        """
        return TaskRead.model_validate(self.manager.get_or_404(task_id))

    def create_task(self, project_id: UUID, data: TaskCreate) -> TaskRead:
        """Create a task and return the API response model.

        Args:
            project_id: Parent project primary key.
            data: Validated task creation payload.

        Returns:
            TaskRead: Newly created task.

        Raises:
            HTTPException: If the project is missing or the title is empty.
        """
        return TaskRead.model_validate(self.manager.create(project_id, data))

    def update_task(self, task_id: UUID, data: TaskUpdate) -> TaskRead:
        """Update a task and return the API response model.

        Args:
            task_id: Task primary key.
            data: Validated task update payload.

        Returns:
            TaskRead: Updated task.

        Raises:
            HTTPException: If the task is missing or the title is empty.
        """
        return TaskRead.model_validate(self.manager.update(task_id, data))

    def delete_task(self, task_id: UUID) -> None:
        """Delete a task.

        Args:
            task_id: Task primary key.

        Returns:
            None

        Raises:
            HTTPException: If the task does not exist.
        """
        self.manager.delete(task_id)
