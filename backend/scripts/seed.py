"""Seed demo data for the workshop."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlmodel import Session, select

from app.database import create_db_and_tables, engine
from app.models import Project, Task, TaskStatus


def seed() -> None:
    create_db_and_tables()

    with Session(engine) as session:
        existing = session.exec(select(Project)).first()
        if existing:
            print("Database already seeded, skipping.")
            return

        web_app = Project(name="Web App Launch")
        api_migration = Project(name="API Migration")
        session.add(web_app)
        session.add(api_migration)
        session.commit()
        session.refresh(web_app)
        session.refresh(api_migration)

        tasks = [
            Task(title="Setup Database", description="Create schema and migrations", status=TaskStatus.DONE, project_id=web_app.id),
            Task(title="Implement API", description="Build REST endpoints", status=TaskStatus.IN_PROGRESS, project_id=web_app.id),
            Task(title="Build Frontend", description="Dashboard and project views", status=TaskStatus.TODO, project_id=web_app.id),
            Task(title="Deploy", description="Deploy to production", status=TaskStatus.TODO, project_id=web_app.id),
            Task(title="Audit endpoints", description="Review existing API surface", status=TaskStatus.DONE, project_id=api_migration.id),
            Task(title="Write migration plan", description="Document breaking changes", status=TaskStatus.IN_PROGRESS, project_id=api_migration.id),
        ]

        for task in tasks:
            session.add(task)

        session.commit()
        print(f"Seeded {2} projects and {len(tasks)} tasks.")


if __name__ == "__main__":
    seed()
