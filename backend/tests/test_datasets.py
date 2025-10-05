import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_list_datasets():
    """Test the /datasets endpoint returns a list of datasets"""
    response = client.get("/datasets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # check required fields
    assert "id" in data[0]
    assert "name" in data[0]
    assert "source" in data[0]

def test_single_dataset():
    """Test retrieving a single dataset by ID"""
    response = client.get("/datasets/mola_hrsc")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "mola_hrsc"
    assert "name" in data
