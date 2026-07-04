"""seed demo data

Revision ID: e478ddcffa15
Revises: 45e7b0ada545
Create Date: 2026-07-04 10:05:55.153998

"""
from datetime import datetime, timezone
from typing import Sequence, Union
from uuid import uuid4

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e478ddcffa15"
down_revision: Union[str, None] = "45e7b0ada545"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

project_table = sa.table(
    "project",
    sa.column("id", sa.Uuid),
    sa.column("name", sa.String),
    sa.column("created_at", sa.DateTime(timezone=True)),
)

task_table = sa.table(
    "task",
    sa.column("id", sa.Uuid),
    sa.column("title", sa.String),
    sa.column("description", sa.String),
    sa.column("status", sa.Enum(name="taskstatus")),
    sa.column("project_id", sa.Uuid),
    sa.column("created_at", sa.DateTime(timezone=True)),
)


def upgrade() -> None:
    seeded_at = datetime.now(timezone.utc)
    web_app_id = uuid4()
    api_migration_id = uuid4()

    op.bulk_insert(
        project_table,
        [
            {"id": web_app_id, "name": "Web App Launch", "created_at": seeded_at},
            {"id": api_migration_id, "name": "API Migration", "created_at": seeded_at},
        ],
    )
    op.bulk_insert(
        task_table,
        [
            {
                "id": uuid4(),
                "title": "Setup Database",
                "description": "Create schema and migrations",
                "status": "done",
                "project_id": web_app_id,
                "created_at": seeded_at,
            },
            {
                "id": uuid4(),
                "title": "Implement API",
                "description": "Build REST endpoints",
                "status": "in_progress",
                "project_id": web_app_id,
                "created_at": seeded_at,
            },
            {
                "id": uuid4(),
                "title": "Build Frontend",
                "description": "Dashboard and project views",
                "status": "todo",
                "project_id": web_app_id,
                "created_at": seeded_at,
            },
            {
                "id": uuid4(),
                "title": "Deploy",
                "description": "Deploy to production",
                "status": "todo",
                "project_id": web_app_id,
                "created_at": seeded_at,
            },
            {
                "id": uuid4(),
                "title": "Audit endpoints",
                "description": "Review existing API surface",
                "status": "done",
                "project_id": api_migration_id,
                "created_at": seeded_at,
            },
            {
                "id": uuid4(),
                "title": "Write migration plan",
                "description": "Document breaking changes",
                "status": "in_progress",
                "project_id": api_migration_id,
                "created_at": seeded_at,
            },
        ],
    )


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM task"))
    op.execute(sa.text("DELETE FROM project"))
