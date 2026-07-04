"""HTTP controller for task endpoints."""

from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.managers import TaskManager
from app.schemas import TaskCreate, TaskRead, TaskUpdate


class TaskController:
    """Translate task HTTP operations into manager calls."""

    def __init__(self, db: Session) -> None:
        """Initialize the controller with an active database session.

        Args:
            db: SQLAlchemy session passed to the task manager.
        """
        self.manager = TaskManager(db)

    def list_tasks(self, project_id: UUID) -> list[TaskRead]:
        """Return all tasks for a project as API response models.

        Args:
            project_id: Parent project primary key.

        Returns:
            list[TaskRead]: Tasks belonging to the project.

        Raises:
            HTTPException: If the parent project does not exist.
        """
        return [TaskRead.model_validate(t) for t in self.manager.list_by_project(project_id)]

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
