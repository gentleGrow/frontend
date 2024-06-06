from datetime import datetime
from uuid import uuid4

import pytest

from app.common.auth.constant import REDIS_EXPIRE_TIME_SECOND
from app.module.auth.enum import ProviderEnum, UserRoleEnum
from app.module.auth.model import User as UserModel
from app.module.auth.repository import RedisJWTTokenRepository


@pytest.mark.asyncio
class RedisTokenRepositoryTest:
    async def test_save_token(mock_redis):
        token_repository = RedisJWTTokenRepository(redis_client=mock_redis)
        await token_repository.save("user_id", "token_value", REDIS_EXPIRE_TIME_SECOND)
        mock_redis.set.assert_called_once_with("user_id", "token_value")
        mock_redis.expire.assert_called_once_with("user_id", REDIS_EXPIRE_TIME_SECOND)

    async def test_get_token(mock_redis):
        mock_redis.get.return_value = "token_value"
        token_repository = RedisJWTTokenRepository(redis_client=mock_redis)
        token = await token_repository.get("user_id")
        assert token == "token_value"
        mock_redis.get.assert_called_once_with("user_id")


class UserRepositoryTest:
    def test_get_user(mock_session, user_repository):
        user_model = UserModel(
            id=uuid4(),
            social_id="social_test",
            provider=ProviderEnum.GOOGLE,
            role=UserRoleEnum.user,
            nickname="test_user",
            created_at=datetime.now(),
        )
        mock_session.query.return_value.filter.return_value.first.return_value = user_model

        user = user_repository.get(mock_session, "social_test", ProviderEnum.GOOGLE)
        assert user is not None
        assert user.social_id == "social_test"
        mock_session.query.assert_called_once_with(UserModel)

    def test_create_user(mock_session, user_repository):
        user_schema = user_repository.create(
            mock_session,
            social_id="social_test",
            provider=ProviderEnum.GOOGLE,
            role=UserRoleEnum.USER,
            nickname="test_user",
        )

        assert user_schema.social_id == "social_test"

        assert mock_session.add.called
        assert mock_session.commit.called
        assert mock_session.refresh.called
