from os import getenv
from unittest.mock import patch

import pytest
from dotenv import load_dotenv

from app.module.auth.service import Google

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


@pytest.mark.asyncio
@patch("app.module.auth.service.id_token.verify_oauth2_token")
async def test_verify_token_success(mock_verify_oauth2_token):
    mock_verify_oauth2_token.return_value = {"sub": "1234567890"}
    token = "valid_token"

    result = await Google.verify_token(token)

    assert result == {"sub": "1234567890"}
    mock_verify_oauth2_token.assert_called_once()


@pytest.mark.asyncio
@patch("app.module.auth.service.id_token.verify_oauth2_token")
async def test_verify_token_invalid_token(mock_verify_oauth2_token):
    mock_verify_oauth2_token.side_effect = ValueError("Invalid token")
    token = "invalid_token"

    with pytest.raises(ValueError) as exc_info:
        await Google.verify_token(token)

    assert str(exc_info.value) == "Invalid token"
    mock_verify_oauth2_token.assert_called_once()
