"""REST API route definitions."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.controllers import ProjectController, TaskController
from app.database import get_db
from app.models import TaskStatus
from app.schemas import (
    PaginatedProjects,
    PaginatedTasks,
    ProjectCreate,
    ProjectDetailRead,
    ProjectRead,
    ProjectUpdate,
    TaskCreate,
    TaskRead,
    TaskUpdate,
)

router = APIRouter()


def project_controller(db: Session = Depends(get_db)) -> ProjectController:
    """Provide a project controller bound to the request session.

    Args:
        db: Database session injected by FastAPI.

    Returns:
        ProjectController: Controller scoped to the current request.
    """
    return ProjectController(db)


def task_controller(db: Session = Depends(get_db)) -> TaskController:
    """Provide a task controller bound to the request session.

    Args:
        db: Database session injected by FastAPI.

    Returns:
        TaskController: Controller scoped to the current request.
    """
    return TaskController(db)


@router.get("/projects", response_model=PaginatedProjects)
def list_projects(
    search: str | None = Query(default=None, max_length=200),
    limit: int = Query(default=12, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    controller: ProjectController = Depends(project_controller),
) -> PaginatedProjects:
    """List projects with pagination and optional search.

    Args:
        search: Optional case-insensitive name filter.
        limit: Maximum rows to return.
        offset: Number of rows to skip.
        controller: Project controller for the current request.

    Returns:
        PaginatedProjects: Matching projects with task counts.
    """
    return controller.list_projects(search=search, limit=limit, offset=offset)


@router.post("/projects", response_model=ProjectRead, status_code=201)
def create_project(
    data: ProjectCreate,
    controller: ProjectController = Depends(project_controller),
) -> ProjectRead:
    """Create a new project.

    Args:
        data: Project creation payload.
        controller: Project controller for the current request.

    Returns:
        ProjectRead: Newly created project.
    """
    return controller.create_project(data)


@router.get("/projects/{project_id}", response_model=ProjectDetailRead)
def get_project(
    project_id: UUID,
    controller: ProjectController = Depends(project_controller),
) -> ProjectDetailRead:
    """Return a project by ID with task counts.

    Args:
        project_id: Project primary key.
        controller: Project controller for the current request.

    Returns:
        ProjectDetailRead: Matching project with aggregated task counts.
    """
    return controller.get_project(project_id)


@router.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    controller: ProjectController = Depends(project_controller),
) -> ProjectRead:
    """Update a project by ID.

    Args:
        project_id: Project primary key.
        data: Project update payload.
        controller: Project controller for the current request.

    Returns:
        ProjectRead: Updated project.
    """
    return controller.update_project(project_id, data)


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: UUID,
    controller: ProjectController = Depends(project_controller),
) -> None:
    """Delete a project and its tasks.

    Args:
        project_id: Project primary key.
        controller: Project controller for the current request.

    Returns:
        None
    """
    controller.delete_project(project_id)


@router.get("/projects/{project_id}/tasks", response_model=PaginatedTasks)
def list_tasks(
    project_id: UUID,
    search: str | None = Query(default=None, max_length=200),
    status: TaskStatus | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    controller: TaskController = Depends(task_controller),
) -> PaginatedTasks:
    """List tasks for a project with pagination and optional filters.

    Args:
        project_id: Parent project primary key.
        search: Optional case-insensitive title/description filter.
        status: Optional workflow status filter.
        limit: Maximum rows to return.
        offset: Number of rows to skip.
        controller: Task controller for the current request.

    Returns:
        PaginatedTasks: Matching tasks for the project.
    """
    return controller.list_tasks(
        project_id,
        search=search,
        status=status,
        limit=limit,
        offset=offset,
    )


@router.post("/projects/{project_id}/tasks", response_model=TaskRead, status_code=201)
def create_task(
    project_id: UUID,
    data: TaskCreate,
    controller: TaskController = Depends(task_controller),
) -> TaskRead:
    """Create a new task in a project.

    Args:
        project_id: Parent project primary key.
        data: Task creation payload.
        controller: Task controller for the current request.

    Returns:
        TaskRead: Newly created task.
    """
    return controller.create_task(project_id, data)


@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(
    task_id: UUID,
    controller: TaskController = Depends(task_controller),
) -> TaskRead:
    """Return a task by ID.

    Args:
        task_id: Task primary key.
        controller: Task controller for the current request.

    Returns:
        TaskRead: Matching task.
    """
    return controller.get_task(task_id)


@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    task_id: UUID,
    data: TaskUpdate,
    controller: TaskController = Depends(task_controller),
) -> TaskRead:
    """Update a task by ID.

    Args:
        task_id: Task primary key.
        data: Task update payload.
        controller: Task controller for the current request.

    Returns:
        TaskRead: Updated task.
    """
    return controller.update_task(task_id, data)


@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: UUID,
    controller: TaskController = Depends(task_controller),
) -> None:
    """Delete a task by ID.

    Args:
        task_id: Task primary key.
        controller: Task controller for the current request.

    Returns:
        None
    """
    controller.delete_task(task_id)
