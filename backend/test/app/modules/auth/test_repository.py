from datetime import datetime
from uuid import uuid4

import pytest

from app.modules.auth.enums import ProviderEnum, UserRoleEnum
from app.modules.auth.models import User as UserModel
from app.modules.auth.repository import RedisTokenRepository
from app.modules.auth.schemas import User as UserSchema


@pytest.mark.asyncio
async def test_save_token(mock_redis):
    token_repository = RedisTokenRepository(redis_client=mock_redis)
    await token_repository.save("user_id", "token_value", 3600)
    mock_redis.set.assert_called_once_with("user_id", "token_value")
    mock_redis.expire.assert_called_once_with("user_id", 3600)


@pytest.mark.asyncio
async def test_get_token(mock_redis):
    mock_redis.get.return_value = "token_value"
    token_repository = RedisTokenRepository(redis_client=mock_redis)
    token = await token_repository.get("user_id")
    assert token == "token_value"
    mock_redis.get.assert_called_once_with("user_id")


def test_get_user(mock_session, user_repository):
    user_model = UserModel(
        id=uuid4(),
        social_id="social_test",
        provider=ProviderEnum.google,
        role=UserRoleEnum.user,
        nickname="test_user",
        created_at=datetime.now(),
    )
    mock_session.query.return_value.filter.return_value.first.return_value = user_model

    user = user_repository.get(mock_session, "social_test", ProviderEnum.google)
    assert user is not None
    assert user.social_id == "social_test"
    mock_session.query.assert_called_once_with(UserModel)


def test_create_user(mock_session, user_repository):
    user_schema = user_repository.create(
        mock_session,
        social_id="social_test",
        provider=ProviderEnum.google,
        role=UserRoleEnum.user,
        nickname="test_user",
    )

    assert user_schema is not None
    assert isinstance(user_schema, UserSchema)
    assert user_schema.social_id == "social_test"

    assert mock_session.add.called
    assert mock_session.commit.called
    assert mock_session.refresh.called
