from unittest.mock import patch

import pytest
from authlib.integrations.starlette_client import OAuthError
from fastapi import HTTPException
from httpx import Response
from starlette.requests import Request

from api.v1.auth.service.kakao_service import authenticate_with_kakao


@pytest.mark.asyncio
@patch("api.v1.auth.service.kakao_service.oauth.kakao.authorize_access_token")
@patch("httpx.AsyncClient.get")
async def test_authenticate_with_kakao_success(mock_get, mock_authorize_access_token):
    mock_authorize_access_token.return_value = {"access_token": "test_access_token"}
    mock_response = Response(status_code=200, json={"id": "12345"})
    mock_get.return_value = mock_response

    request = Request(scope={"type": "http"})

    social_id = await authenticate_with_kakao(request)

    assert social_id == "12345"
    mock_get.assert_called_once_with(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": "Bearer test_access_token"},
    )


@pytest.mark.asyncio
@patch("api.v1.auth.service.kakao_service.oauth.kakao.authorize_access_token")
async def test_authenticate_with_kakao_oauth_error(mock_authorize_access_token):
    mock_authorize_access_token.side_effect = OAuthError(error="OAuth error")

    request = Request(scope={"type": "http"})

    with pytest.raises(HTTPException) as exc_info:
        await authenticate_with_kakao(request)

    assert exc_info.value.status_code == 400
    assert "OAuth 에러가 발생하였습니다 : OAuth error" in str(exc_info.value.detail)


@pytest.mark.asyncio
@patch("api.v1.auth.service.kakao_service.oauth.kakao.authorize_access_token")
@patch("httpx.AsyncClient.get")
async def test_fetch_kakao_user_info_failure(mock_get, mock_authorize_access_token):
    mock_authorize_access_token.return_value = {"access_token": "invalid_access_token"}
    mock_response = Response(status_code=400, json={"error": "invalid_token"})
    mock_get.return_value = mock_response

    request = Request(scope={"type": "http"})

    with pytest.raises(HTTPException) as exc_info:
        await authenticate_with_kakao(request)

    assert exc_info.value.status_code == 400
    assert "구글 토큰 내에 유저 고유 ID가 존재하지 않습니다." in str(exc_info.value.detail)
