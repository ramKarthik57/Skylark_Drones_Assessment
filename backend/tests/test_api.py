import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_boards_status_endpoint():
    response = client.get("/api/boards/status")
    assert response.status_code == 200
    data = response.json()
    assert "deals_count" in data
    assert "work_orders_count" in data
    assert data["deals_count"] > 0

def test_chat_endpoint():
    response = client.post("/api/chat", json={"message": "How is our pipeline looking this quarter?"})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "pipeline"
    assert "text" in data
    assert data["bi_data"] is not None

def test_leadership_update_endpoint():
    response = client.get("/api/leadership-update")
    assert response.status_code == 200
    data = response.json()
    assert "markdown_report" in data
    assert "Executive Leadership Update" in data["markdown_report"]
