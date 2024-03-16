from unittest.mock import AsyncMock, patch

import pytest
from authlib.integrations.starlette_client import OAuthError
from fastapi import HTTPException
from starlette.requests import Request

from api.v1.auth.service.naver_service import (
    authenticate_with_naver,
    fetch_naver_user_info,
)


@pytest.mark.asyncio
@patch("api.v1.auth.service.naver_service.oauth.naver.authorize_access_token")
@patch("httpx.AsyncClient.get")
async def test_authenticate_with_naver_success(mock_get, mock_authorize_access_token):

    mock_user_info_response = {"response": {"id": "naver_user_id"}}
    mock_get.return_value = AsyncMock(
        status_code=200, json=AsyncMock(return_value=mock_user_info_response)
    )

    mock_token_response = {"access_token": "mock_access_token"}
    mock_authorize_access_token.return_value = mock_token_response

    request = Request(scope={"type": "http"})
    social_id = await authenticate_with_naver(request)

    assert social_id == "naver_user_id"
    mock_get.assert_called_once_with(
        "https://openapi.naver.com/v1/nid/me",
        headers={"Authorization": "Bearer mock_access_token"},
    )


@pytest.mark.asyncio
@patch("api.v1.auth.service.naver_service.oauth.naver.authorize_access_token")
async def test_authenticate_with_naver_oauth_error(mock_authorize_access_token):
    mock_authorize_access_token.side_effect = OAuthError(error="OAuth error")

    request = Request(scope={"type": "http"})
    with pytest.raises(HTTPException) as exc_info:
        await authenticate_with_naver(request)

    assert exc_info.value.status_code == 400
    assert "OAuth 에러가 발생하였습니다 : OAuth error" in str(exc_info.value.detail)


@pytest.mark.asyncio
@patch("api.v1.auth.service.naver_service.oauth.naver.authorize_access_token")
@patch("httpx.AsyncClient.get")
async def test_fetch_naver_user_info_failure(mock_get, mock_authorize_access_token):

    mock_token_response = {"access_token": "mock_access_token"}
    mock_authorize_access_token.return_value = mock_token_response

    mock_get.return_value = AsyncMock(status_code=400)

    request = Request(scope={"type": "http"})
    with pytest.raises(HTTPException) as exc_info:
        await authenticate_with_naver(request)

    assert exc_info.value.status_code == 400
    assert "네이버 사용자 정보를 가져오는 데 실패하였습니다." in str(exc_info.value.detail)
