from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session

from app.models import TaskStatus
from app.repositories import ProjectRepository, TaskRepository
from app.schemas import ProjectCreate, ProjectUpdate, TaskCreate, TaskUpdate


class ProjectService:
    def __init__(self, session: Session):
        self.repo = ProjectRepository(session)

    def list_projects(self):
        return self.repo.list_all()

    def get_project(self, project_id: UUID):
        project = self.repo.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    def create_project(self, data: ProjectCreate):
        name = data.name.strip()
        if not name:
            raise HTTPException(status_code=422, detail="Project name is required")
        return self.repo.create(name)

    def update_project(self, project_id: UUID, data: ProjectUpdate):
        project = self.get_project(project_id)
        name = data.name.strip()
        if not name:
            raise HTTPException(status_code=422, detail="Project name is required")
        return self.repo.update(project, name)

    def delete_project(self, project_id: UUID) -> None:
        project = self.get_project(project_id)
        self.repo.delete(project)


class TaskService:
    def __init__(self, session: Session):
        self.repo = TaskRepository(session)
        self.project_repo = ProjectRepository(session)

    def list_tasks(self, project_id: UUID):
        self._ensure_project_exists(project_id)
        return self.repo.list_by_project(project_id)

    def get_task(self, task_id: UUID):
        task = self.repo.get_by_id(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    def create_task(self, project_id: UUID, data: TaskCreate):
        self._ensure_project_exists(project_id)
        title = data.title.strip()
        if not title:
            raise HTTPException(status_code=422, detail="Task title is required")
        return self.repo.create(
            project_id=project_id,
            title=title,
            description=data.description,
            status=data.status,
        )

    def update_task(self, task_id: UUID, data: TaskUpdate):
        task = self.get_task(task_id)
        fields = data.model_dump(exclude_unset=True)
        if "title" in fields and fields["title"] is not None:
            fields["title"] = fields["title"].strip()
            if not fields["title"]:
                raise HTTPException(status_code=422, detail="Task title is required")
        return self.repo.update(task, **fields)

    def delete_task(self, task_id: UUID) -> None:
        task = self.get_task(task_id)
        self.repo.delete(task)

    def _ensure_project_exists(self, project_id: UUID) -> None:
        if not self.project_repo.get_by_id(project_id):
            raise HTTPException(status_code=404, detail="Project not found")
