import pytest
from fastapi import HTTPException, status
from jwt import decode


@pytest.mark.asyncio
class TestJWT:
    async def test_generate_access_token(self, jwt_builder, mock_jwt_datetime):
        token = jwt_builder.generate_access_token("user_id")
        decoded = decode(token, options={"verify_signature": False})
        assert decoded["sub"] == "user_id"
        assert "exp" in decoded

    async def test_decode_token_success(self, jwt_builder):
        token = jwt_builder.generate_access_token("user_id")
        decoded = jwt_builder.decode_token(token)
        assert decoded["sub"] == "user_id"

    async def test_decode_token_expired(self, jwt_builder, mock_jwt_datetime):
        token = jwt_builder.generate_access_token("user_id")
        with pytest.raises(HTTPException) as exc_info:
            jwt_builder.decode_token(token)

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert exc_info.value.detail == "refresh token이 만료되었습니다."
