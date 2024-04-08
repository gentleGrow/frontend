from unittest.mock import AsyncMock

from fastapi import status
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_google_login(mocker, mock_session):
    mocker.patch("app.modules.auth.handlers.Google.verify_token", return_value={"sub": "some_social_id"})
    mocker.patch("app.api.auth.v1.router.redis_repository.save", new_callable=AsyncMock)
    mocker.patch("app.dependencies.database.get_mysql_session", return_value=mock_session)
    mocker.patch("app.modules.auth.handlers.Google.get_access_token", return_value="mocked_access_token")
    mocker.patch("app.modules.auth.handlers.Google.get_refresh_token", return_value="mocked_refresh_token")

    payload = {"id_token": "valid_token"}
    response = client.post("/api/auth/google", json=payload)

    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["access_token"] == "mocked_access_token"
    assert response_data["refresh_token"] == "mocked_refresh_token"


def test_refresh_access_token(mocker):
    mocker.patch("app.service.singleton.redis_repository.get", AsyncMock(return_value="valid_refresh_token"))
    mocker.patch("app.common.auth.jwt.JWTBuilder.decode_token", return_value={"sub": "user_id"})
    mocker.patch("app.common.auth.jwt.JWTBuilder.generate_access_token", return_value="new_access_token")

    payload = {"refresh_token": "valid_refresh_token"}
    response = client.post("/api/auth/refresh", json=payload)

    assert response.status_code == status.HTTP_200_OK, response.text
    assert response.json() == {"access_token": "new_access_token"}
