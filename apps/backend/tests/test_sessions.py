from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_sessions():
    response = client.get("/sessions/")
    assert response.status_code == 200
    assert "sessions" in response.json()

def test_create_session():
    response = client.post("/sessions/")
    assert response.status_code == 200
    assert response.json()["message"] == "Session created (placeholder)"
