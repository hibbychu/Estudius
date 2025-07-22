from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert "tasks" in response.json()

def test_create_task():
    response = client.post("/tasks/")
    assert response.status_code == 200
    assert response.json()["message"] == "Task created (placeholder)"
