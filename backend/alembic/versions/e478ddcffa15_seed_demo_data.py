"""seed demo data

Revision ID: e478ddcffa15
Revises: 45e7b0ada545
Create Date: 2026-07-04 10:05:55.153998

"""
from datetime import datetime, timedelta, timezone
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

PROJECT_TASKS: dict[str, list[tuple[str, str, str]]] = {
    "Acme Corp — Customer Portal Redesign": [
        ("Audit current portal UX", "Review analytics, support tickets, and session recordings", "done"),
        ("Interview key account managers", "Capture pain points from sales and success teams", "done"),
        ("Design updated navigation model", "Simplify account settings, billing, and support entry points", "done"),
        ("Build billing history views", "Invoices, payment methods, and download receipts", "in_progress"),
        ("Implement SSO with Okta", "SAML integration for enterprise customers", "in_progress"),
        ("Migrate legacy user preferences", "Map old notification settings to new schema", "todo"),
        ("Run accessibility audit", "WCAG 2.1 AA on login, dashboard, and billing flows", "todo"),
    ],
    "Northwind Logistics — Fleet Tracker": [
        ("Map dispatch workflow", "Document how coordinators assign routes today", "done"),
        ("Define GPS event schema", "Location pings, idle time, and geofence alerts", "done"),
        ("Prototype live map dashboard", "Real-time vehicle markers with status filters", "in_progress"),
        ("Integrate telematics API", "Pull odometer and fuel data from Samsara", "in_progress"),
        ("Add driver mobile check-in", "Start/end shift with photo verification", "todo"),
        ("Configure SLA alert rules", "Late delivery and idle-threshold notifications", "todo"),
        ("Pilot with Dallas hub", "Two-week rollout with dispatch team feedback", "todo"),
    ],
    "Brightline Health — Patient Intake Forms": [
        ("Gather compliance requirements", "HIPAA fields review with legal team", "done"),
        ("Draft form field inventory", "Demographics, insurance, and consent blocks", "done"),
        ("Design mobile-first intake flow", "Progressive disclosure for long questionnaires", "done"),
        ("Connect to EHR sandbox", "Submit completed forms to Epic FHIR test env", "in_progress"),
        ("Build admin form builder", "Clinic staff can reorder sections per specialty", "in_progress"),
        ("Add Spanish localization", "Translate labels and validation messages", "todo"),
        ("UAT with Riverside Clinic", "Five front-desk staff walkthrough sessions", "todo"),
    ],
    "Harbor & Co. — E-commerce Checkout Refresh": [
        ("Analyze cart abandonment funnel", "Compare mobile vs desktop drop-off steps", "done"),
        ("Benchmark competitor checkout flows", "Shopify Plus stores in home goods category", "done"),
        ("Redesign shipping selector", "Clear delivery windows and pickup options", "in_progress"),
        ("Integrate Apple Pay and Google Pay", "Wallet buttons on cart and express checkout", "in_progress"),
        ("Add address autocomplete", "Google Places for faster shipping entry", "todo"),
        ("Load test peak traffic scenario", "Simulate Black Friday order volume", "todo"),
        ("Prepare merchandising launch brief", "Coordinate with email and paid media teams", "todo"),
    ],
    "Summit Legal — Contract Repository": [
        ("Inventory existing contract storage", "SharePoint folders, email attachments, and CLM exports", "done"),
        ("Define metadata taxonomy", "Counterparty, renewal date, governing law, owner", "done"),
        ("Import historical PDF batch", "OCR and index 2,400 legacy agreements", "in_progress"),
        ("Build full-text search", "Filter by clause type, value, and expiration window", "in_progress"),
        ("Set up renewal reminders", "90/60/30-day alerts to contract owners", "todo"),
        ("Role-based access controls", "Partner, associate, and paralegal permission tiers", "todo"),
        ("Train practice group leads", "Office hours for M&A and commercial teams", "todo"),
    ],
    "Greenfield Solar — Installer Scheduling App": [
        ("Shadow site survey crews", "Observe how leads are assigned today", "done"),
        ("Model crew capacity calendar", "Skills, regions, and equipment constraints", "done"),
        ("Build drag-and-drop scheduler", "Dispatch view with weather overlay", "in_progress"),
        ("Sync with Salesforce opportunities", "Auto-create jobs when deals close won", "in_progress"),
        ("Customer appointment confirmations", "SMS reminders with reschedule link", "todo"),
        ("Offline mode for field tablets", "Cache job packets without connectivity", "todo"),
        ("Roll out to Arizona territory", "Monitor booking time and reschedule rate", "todo"),
    ],
    "Metro Property Group — Tenant Maintenance Portal": [
        ("Catalog maintenance request types", "Plumbing, HVAC, access, and common area issues", "done"),
        ("Define priority matrix", "Emergency vs standard response SLAs by category", "done"),
        ("Resident submission flow", "Photos, unit number, and availability windows", "done"),
        ("Vendor assignment rules", "Route by property, trade, and on-call roster", "in_progress"),
        ("Status tracking for residents", "Submitted, scheduled, in progress, resolved", "in_progress"),
        ("Superintendent mobile inbox", "Approve vendor quotes under threshold", "todo"),
        ("Launch at Parkview Towers", "First building with 180 units", "todo"),
    ],
    "Atlas Manufacturing — Quality Inspection Dashboard": [
        ("Document shop-floor inspection steps", "Line leaders walkthrough at Plant 3", "done"),
        ("Digitize checklists per SKU", "Pass/fail criteria and photo capture points", "done"),
        ("Connect MES defect feed", "Pull reject codes from line scanners", "in_progress"),
        ("Shift supervisor dashboard", "Defect rate, downtime, and open corrective actions", "in_progress"),
        ("Trend reports by batch", "Weekly export for continuous improvement team", "todo"),
        ("Alert on SPC threshold breach", "Email QA manager when variance exceeds limit", "todo"),
        ("Validate with night shift pilot", "Two-week parallel run against paper forms", "todo"),
    ],
    "Riverstone Bank — Loan Application Tracker": [
        ("Map loan officer workflow", "From application intake to underwriting handoff", "done"),
        ("Define pipeline stages", "Submitted, docs pending, underwriting, approved, funded", "done"),
        ("Borrower document upload portal", "Pay stubs, tax returns, and ID verification", "in_progress"),
        ("Integrate credit pull service", "Soft pull at pre-qual, hard pull at submission", "in_progress"),
        ("Officer task queue", "Missing docs and follow-up call reminders", "todo"),
        ("Compliance audit trail", "Immutable log of status changes and reviewers", "todo"),
        ("Pilot with retail branch network", "Six branches in the Columbus region", "todo"),
    ],
    "Pioneer EdTech — Course Authoring Platform": [
        ("Research instructor authoring pain points", "Interviews with five department leads", "done"),
        ("Outline module and lesson structure", "Videos, quizzes, readings, and assignments", "done"),
        ("WYSIWYG lesson editor", "Embed media, code blocks, and downloadable files", "in_progress"),
        ("Version history and drafts", "Compare revisions before publishing to students", "in_progress"),
        ("Preview as student mode", "Validate layout on phone and tablet breakpoints", "todo"),
        ("Publish workflow with review", "Department chair approval before go-live", "todo"),
        ("Beta with Biology 101 cohort", "Fall semester limited release", "todo"),
    ],
}


def upgrade() -> None:
    base_time = datetime(2025, 9, 1, 9, 0, tzinfo=timezone.utc)
    projects: list[dict] = []
    tasks: list[dict] = []

    for index, (name, project_tasks) in enumerate(PROJECT_TASKS.items()):
        project_id = uuid4()
        project_created = base_time + timedelta(days=index * 5)
        projects.append({"id": project_id, "name": name, "created_at": project_created})

        for task_index, (title, description, status) in enumerate(project_tasks):
            tasks.append(
                {
                    "id": uuid4(),
                    "title": title,
                    "description": description,
                    "status": status,
                    "project_id": project_id,
                    "created_at": project_created + timedelta(hours=task_index + 1),
                }
            )

    op.bulk_insert(project_table, projects)
    op.bulk_insert(task_table, tasks)


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM task"))
    op.execute(sa.text("DELETE FROM project"))
