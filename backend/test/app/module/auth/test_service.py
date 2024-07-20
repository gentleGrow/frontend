from os import getenv
from unittest.mock import MagicMock, patch

import pytest
from dotenv import load_dotenv

from app.module.auth.service import Google, Kakao

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


@pytest.mark.asyncio
@patch("httpx.AsyncClient.post")
async def test_kakao_verify_token_success(mock_post):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "iss": "https://kauth.kakao.com",
        "aud": "app_key",
        "sub": "1234567890",
        "iat": 1647183250,
        "exp": 1647190450,
        "nonce": "nonce",
        "auth_time": 1647183250,
    }
    mock_post.return_value = mock_response

    token = "valid_token"

    result = await Kakao.verify_token(token)

    assert result == {
        "iss": "https://kauth.kakao.com",
        "aud": "app_key",
        "sub": "1234567890",
        "iat": 1647183250,
        "exp": 1647190450,
        "nonce": "nonce",
        "auth_time": 1647183250,
    }
    mock_post.assert_called_once()


@pytest.mark.asyncio
@patch("httpx.AsyncClient.post")
async def test_kakao_verify_token_invalid_token(mock_post):
    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.json.return_value = {
        "error": "invalid_token",
        "error_description": "Invalid token",
        "error_code": "KOE400",
    }
    mock_post.return_value = mock_response

    token = "invalid_token"

    with pytest.raises(ValueError) as exc_info:
        await Kakao.verify_token(token)

    assert str(exc_info.value) == "Invalid token"
    mock_post.assert_called_once()


@pytest.mark.asyncio
@patch("app.module.auth.service.id_token.verify_oauth2_token")
async def test_google_verify_token_success(mock_verify_oauth2_token):
    mock_verify_oauth2_token.return_value = {"sub": "1234567890"}
    token = "valid_token"

    result = await Google.verify_token(token)

    assert result == {"sub": "1234567890"}
    mock_verify_oauth2_token.assert_called_once()


@pytest.mark.asyncio
@patch("app.module.auth.service.id_token.verify_oauth2_token")
async def test_google_verify_token_invalid_token(mock_verify_oauth2_token):
    mock_verify_oauth2_token.side_effect = ValueError("Invalid token")
    token = "invalid_token"

    with pytest.raises(ValueError) as exc_info:
        await Google.verify_token(token)

    assert str(exc_info.value) == "Invalid token"
    mock_verify_oauth2_token.assert_called_once()
