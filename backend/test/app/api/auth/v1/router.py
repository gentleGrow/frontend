from unittest.mock import patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.module.auth.jwt import JWTBuilder
from main import app

client = TestClient(app)


@pytest.mark.asyncio
async def test_google_login_no_id_token():
    request_payload = {}

    response = client.post("/api/auth/v1/google", json=request_payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response_data = response.json()

    assert response_data["detail"][0]["msg"] == "Field required"
    assert response_data["detail"][0]["type"] == "missing"


@pytest.mark.asyncio
@patch("app.api.auth.v1.router.Google.verify_token")
async def test_google_login_missing_sub(mock_google_verify):
    mock_google_verify.return_value = {}

    request_payload = {"id_token": "fake_id_token"}
    response = client.post("/api/auth/v1/google", json=request_payload)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response_data = response.json()
    assert response_data["detail"] == "id token에 유저 정보가 없습니다."


@pytest.mark.asyncio
@patch("app.api.auth.v1.router.Google.verify_token")
@patch("app.api.auth.v1.router.UserRepository.get_by_social_id")
@patch("app.api.auth.v1.router.UserRepository.create")
async def test_google_login_user_creation(
    mock_create_user, mock_get_user, mock_google_verify, user_instance, mock_redis_repositories
):
    mock_google_verify.return_value = {"sub": "google_social_id"}
    mock_get_user.return_value = None
    mock_create_user.return_value = user_instance

    request_payload = {"id_token": "fake_id_token"}

    response = client.post("/api/auth/v1/google", json=request_payload)

    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()

    assert "access_token" in response_data
    assert "refresh_token" in response_data

    assert JWTBuilder.decode_token(response_data["access_token"])["user"] == "1"
    assert JWTBuilder.decode_token(response_data["refresh_token"])["user"] == "1"
