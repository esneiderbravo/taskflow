import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.database import get_session
from app.main import app
from app.models import TaskStatus


@pytest.fixture(name="client")
def client_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def get_test_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_project(client: TestClient):
    response = client.post("/projects", json={"name": "New Project"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Project"
    assert "id" in data


def test_list_projects(client: TestClient):
    client.post("/projects", json={"name": "Alpha"})
    client.post("/projects", json={"name": "Beta"})
    response = client.get("/projects")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_create_task(client: TestClient):
    project = client.post("/projects", json={"name": "Task Project"}).json()
    response = client.post(
        f"/projects/{project['id']}/tasks",
        json={"title": "First task", "description": "Do something"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "First task"
    assert data["status"] == TaskStatus.TODO.value


def test_update_task_status(client: TestClient):
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


def test_delete_project_cascades_tasks(client: TestClient):
    project = client.post("/projects", json={"name": "Delete Me"}).json()
    client.post(f"/projects/{project['id']}/tasks", json={"title": "Orphan task"})
    response = client.delete(f"/projects/{project['id']}")
    assert response.status_code == 204
    tasks = client.get(f"/projects/{project['id']}/tasks")
    assert tasks.status_code == 404
