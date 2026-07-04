from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.schemas import ProjectCreate, ProjectRead, ProjectUpdate, TaskCreate, TaskRead, TaskUpdate
from app.services import ProjectService, TaskService

router = APIRouter()


@router.get("/projects", response_model=list[ProjectRead])
def list_projects(session: Session = Depends(get_session)):
    return ProjectService(session).list_projects()


@router.post("/projects", response_model=ProjectRead, status_code=201)
def create_project(data: ProjectCreate, session: Session = Depends(get_session)):
    return ProjectService(session).create_project(data)


@router.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(project_id: UUID, session: Session = Depends(get_session)):
    return ProjectService(session).get_project(project_id)


@router.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    session: Session = Depends(get_session),
):
    return ProjectService(session).update_project(project_id, data)


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: UUID, session: Session = Depends(get_session)):
    ProjectService(session).delete_project(project_id)


@router.get("/projects/{project_id}/tasks", response_model=list[TaskRead])
def list_tasks(project_id: UUID, session: Session = Depends(get_session)):
    return TaskService(session).list_tasks(project_id)


@router.post("/projects/{project_id}/tasks", response_model=TaskRead, status_code=201)
def create_task(
    project_id: UUID,
    data: TaskCreate,
    session: Session = Depends(get_session),
):
    return TaskService(session).create_task(project_id, data)


@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(task_id: UUID, session: Session = Depends(get_session)):
    return TaskService(session).get_task(task_id)


@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(task_id: UUID, data: TaskUpdate, session: Session = Depends(get_session)):
    return TaskService(session).update_task(task_id, data)


@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: UUID, session: Session = Depends(get_session)):
    TaskService(session).delete_task(task_id)
