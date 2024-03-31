import pytest
from fastapi import HTTPException
from jwt import decode


@pytest.mark.asyncio
async def test_generate_access_token(jwt_builder, mock_jwt_datetime):
    token = jwt_builder.generate_access_token("user_id")

    decoded = decode(token, options={"verify_signature": False})

    assert decoded["sub"] == "user_id"
    assert "exp" in decoded


@pytest.mark.asyncio
async def test_decode_token_success(jwt_builder):
    token = jwt_builder.generate_access_token("user_id")
    decoded = jwt_builder.decode_token(token)

    assert decoded["sub"] == "user_id"


@pytest.mark.asyncio
async def test_decode_token_expired(jwt_builder, mock_jwt_datetime):
    token = jwt_builder.generate_access_token("user_id")

    with pytest.raises(HTTPException) as exc_info:
        jwt_builder.decode_token(token)
    assert exc_info.value.status_code == 401
    assert "만료되었습니다" in exc_info.value.detail
