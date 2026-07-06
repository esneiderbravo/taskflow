"""Integration tests for the REST API."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.database import SessionLocal, engine, get_db
from app.main import app
from app.models import TaskStatus


@pytest.fixture(autouse=True)
def clean_tables() -> None:
    """Remove all rows before each test.

    Returns:
        None
    """
    with engine.connect() as conn:
        conn.execute(text("TRUNCATE TABLE task, project RESTART IDENTITY CASCADE"))
        conn.commit()


@pytest.fixture(name="client")
def client_fixture():
    """Provide a test client connected to PostgreSQL.

    Yields:
        TestClient: FastAPI client with database dependency overridden.
    """

    def get_test_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = get_test_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def test_health(client: TestClient) -> None:
    """Health endpoint returns ok status.

    Args:
        client: API test client.

    Returns:
        None
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_project(client: TestClient) -> None:
    """Project creation returns the created resource.

    Args:
        client: API test client.

    Returns:
        None
    """
    response = client.post("/projects", json={"name": "New Project"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Project"
    assert "id" in data


def test_list_projects(client: TestClient) -> None:
    """Project listing returns paginated results with task totals.

    Args:
        client: API test client.

    Returns:
        None
    """
    client.post("/projects", json={"name": "Alpha"})
    client.post("/projects", json={"name": "Beta"})
    response = client.get("/projects")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["task_total"] == 0
    assert "task_counts" in data["items"][0]


def test_list_projects_search(client: TestClient) -> None:
    """Project search filters by name.

    Args:
        client: API test client.

    Returns:
        None
    """
    client.post("/projects", json={"name": "Website redesign"})
    client.post("/projects", json={"name": "Mobile app"})
    response = client.get("/projects", params={"search": "website"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Website redesign"


def test_list_tasks_pagination(client: TestClient) -> None:
    """Task listing supports pagination and status filters.

    Args:
        client: API test client.

    Returns:
        None
    """
    project = client.post("/projects", json={"name": "Paginated"}).json()
    for index in range(5):
        client.post(
            f"/projects/{project['id']}/tasks",
            json={"title": f"Task {index}"},
        )

    response = client.get(
        f"/projects/{project['id']}/tasks",
        params={"status": TaskStatus.TODO.value, "limit": 2, "offset": 0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2


def test_create_task(client: TestClient) -> None:
    """Task creation returns the created resource with default status.

    Args:
        client: API test client.

    Returns:
        None
    """
    project = client.post("/projects", json={"name": "Task Project"}).json()
    response = client.post(
        f"/projects/{project['id']}/tasks",
        json={"title": "First task", "description": "Do something"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "First task"
    assert data["status"] == TaskStatus.TODO.value


def test_update_task_status(client: TestClient) -> None:
    """Task status can be updated through the API.

    Args:
        client: API test client.

    Returns:
        None
    """
    project = client.post("/projects", json={"name": "Status Project"}).json()
    task = client.post(
        f"/projects/{project['id']}/tasks",
        json={"title": "Status task"},
    ).json()
    response = client.put(
        f"/tasks/{task['id']}",
        json={"status": TaskStatus.IN_PROGRESS.value},
    )
    assert response.status_code == 200
    assert response.json()["status"] == TaskStatus.IN_PROGRESS.value


def test_delete_project_cascades_tasks(client: TestClient) -> None:
    """Deleting a project removes access to its tasks.

    Args:
        client: API test client.

    Returns:
        None
    """
    project = client.post("/projects", json={"name": "Delete Me"}).json()
    client.post(f"/projects/{project['id']}/tasks", json={"title": "Orphan task"})
    response = client.delete(f"/projects/{project['id']}")
    assert response.status_code == 204
    tasks = client.get(f"/projects/{project['id']}/tasks")
    assert tasks.status_code == 404
