from fastapi.testclient import TestClient
from unittest.mock import patch
from backend.main import app

client = TestClient(app)

@patch("backend.routes.tiles.httpx.AsyncClient.get")
def test_fetch_tile_mock(mock_get):
    # fake PNG bytes
    mock_get.return_value.status_code = 200
    mock_get.return_value.content = b"fake_png_data"

    response = client.get("/tiles/mola_hrsc/0/0/0.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"

def test_fetch_tile():
    """Test fetching a single tile from a dataset"""
    response = client.get("/tiles/mola_hrsc/0/0/0.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    # response content should be non-empty
    assert len(response.content) > 0

def test_tile_not_found():
    """Test requesting a tile for a non-existent dataset"""
    response = client.get("/tiles/nonexistent/0/0/0.png")
    assert response.status_code == 404