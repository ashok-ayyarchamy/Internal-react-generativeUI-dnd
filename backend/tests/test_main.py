import pytest
from fastapi.testclient import TestClient


def test_root(client: TestClient):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "AI SDK Backend API"
    assert data["version"] == "0.1.0"


def test_health_check(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_detailed_health_check(client: TestClient):
    """Test detailed health check endpoint."""
    response = client.get("/api/v1/health/detailed")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "message" in data
    assert "timestamp" in data


def test_api_docs_available(client: TestClient):
    """Test that API documentation is available."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_redoc_available(client: TestClient):
    """Test that ReDoc documentation is available."""
    response = client.get("/redoc")
    assert response.status_code == 200 