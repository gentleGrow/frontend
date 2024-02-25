# Library
import pytest
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuthError
# Module
from api.v1.auth.service.google_service import authenticate_with_google

# [정보] async mock 테스트입니다.
@pytest.mark.asyncio
async def test_authenticate_with_google_success():
    request = Request(scope={"type": "http"})

    mock_token_response = {
        'userinfo': {'sub': '12345'}
    }

    with patch('api.v1.auth.service.google_service.oauth.google.authorize_access_token', AsyncMock(return_value=mock_token_response)):
        social_id = await authenticate_with_google(request)
        assert social_id == '12345'

@pytest.mark.asyncio
async def test_authenticate_with_google_user_failure():
    request = Request(scope={"type": "http"})
    
    mock_token_response = {}

    with patch('api.v1.auth.service.google_service.oauth.google.authorize_access_token', AsyncMock(return_value=mock_token_response)):
        with pytest.raises(HTTPException) as exc_info:
            await authenticate_with_google(request)
        assert exc_info.value.status_code == 400
        assert "구글 토큰 내에 유저 고유 ID가 존재하지 않습니다." in str(exc_info.value.detail)

@pytest.mark.asyncio
async def test_authenticate_with_google_oauth_error():
    request = Request(scope={"type": "http"})

    # Ensure the side_effect raises an OAuthError
    with patch('api.v1.auth.service.google_service.oauth.google.authorize_access_token', side_effect=OAuthError(error="OAuth error")):
        with pytest.raises(HTTPException) as exc_info:
            await authenticate_with_google(request)
        assert exc_info.value.status_code == 400
        assert "OAuth 에러가 발생하였습니다" in str(exc_info.value.detail)
