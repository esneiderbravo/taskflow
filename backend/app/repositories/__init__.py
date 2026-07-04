from uuid import UUID

from sqlmodel import Session, select

from app.models import Project, Task


class ProjectRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_all(self) -> list[Project]:
        return list(self.session.exec(select(Project).order_by(Project.created_at)).all())

    def get_by_id(self, project_id: UUID) -> Project | None:
        return self.session.get(Project, project_id)

    def create(self, name: str) -> Project:
        project = Project(name=name)
        self.session.add(project)
        self.session.commit()
        self.session.refresh(project)
        return project

    def update(self, project: Project, name: str) -> Project:
        project.name = name
        self.session.add(project)
        self.session.commit()
        self.session.refresh(project)
        return project

    def delete(self, project: Project) -> None:
        tasks = self.session.exec(select(Task).where(Task.project_id == project.id)).all()
        for task in tasks:
            self.session.delete(task)
        self.session.delete(project)
        self.session.commit()


class TaskRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_by_project(self, project_id: UUID) -> list[Task]:
        statement = select(Task).where(Task.project_id == project_id).order_by(Task.created_at)
        return list(self.session.exec(statement).all())

    def get_by_id(self, task_id: UUID) -> Task | None:
        return self.session.get(Task, task_id)

    def create(
        self,
        project_id: UUID,
        title: str,
        description: str | None = None,
        status=None,
    ) -> Task:
        from app.models import TaskStatus

        task = Task(
            title=title,
            description=description,
            status=status or TaskStatus.TODO,
            project_id=project_id,
        )
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def update(self, task: Task, **fields) -> Task:
        for key, value in fields.items():
            if value is not None:
                setattr(task, key, value)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self.session.delete(task)
        self.session.commit()
