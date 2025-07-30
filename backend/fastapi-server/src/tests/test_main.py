"""
Tests for FastAPI main application
"""

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_chat_endpoint(client):
    """Test chat endpoint"""
    response = client.post("/chat", json={"message": "hello"})
    assert response.status_code == 200
    assert "response" in response.json()
