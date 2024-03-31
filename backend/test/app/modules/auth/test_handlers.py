from unittest.mock import patch

import pytest


@pytest.mark.asyncio
async def test_verify_token_success(google_auth):
    with patch("app.modules.auth.handlers.id_token.verify_oauth2_token") as mock_verify:
        mock_verify.return_value = {"sub": "123456789"}

        token = "dummy_token"
        id_info = await google_auth.verify_token(token)

        mock_verify.assert_called_once()
        assert id_info["sub"] == "123456789"
