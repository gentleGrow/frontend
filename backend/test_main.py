from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)


@pytest.fixture
def setup_function():
    # [정보] 각 테스트 함수별 초기화 필요 로직을 담습니다.
    pass 

def test_read_todos():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == []

def test_create_todo():
    response = client.post("/", json={"name": "Buy groceries", "completed": False})
    assert response.status_code == 200
    assert response.json() == {"name": "Buy groceries", "completed": False}


def test_delete_todo():
    client.post("/", json={"name": "Buy groceries", "completed": False})
    response = client.delete("/1")
    assert response.status_code == 200
    assert response.json() == {"name": "Buy groceries", "completed": False}