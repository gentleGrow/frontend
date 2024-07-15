from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.common.repository.base_repository import AbstractCRUDRepository
from app.module.auth.enum import ProviderEnum, UserRoleEnum
from app.module.auth.model import User as UserModel
from app.module.auth.schema import User as UserSchema


class UserRepository:
    @staticmethod
    async def get_by_social_id(db: AsyncSession, social_id: str, provider: ProviderEnum) -> UserSchema | None:
        select_instance = select(UserModel).where(
            UserModel.social_id == social_id, UserModel.provider == provider.value
        )

        result = await db.execute(select_instance)
        user = result.scalars().first()
        return user and UserSchema.model_validate(user)

    @staticmethod
    async def get(db: AsyncSession, user_id: int) -> UserSchema | None:
        select_instance = select(UserModel).where(UserModel.id == user_id)
        result = await db.execute(select_instance)
        user = result.scalars().first()
        return user and UserSchema.model_validate(user)

    @staticmethod
    async def create(
        db: AsyncSession,
        social_id: str,
        provider: ProviderEnum,
        role: UserRoleEnum = UserRoleEnum.USER,
        nickname: str = None,
        user_id: int = None,
    ) -> None:
        new_user = UserModel(
            id=user_id,
            social_id=social_id,
            provider=provider.value,
            role=role,
            nickname=nickname,
        )

        db.add(new_user)
        await db.commit()


class RedisJWTTokenRepository(AbstractCRUDRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def save(self, user_id: str, token: str, expiry: int) -> None:
        await self.redis.set(user_id, token)
        await self.redis.expire(user_id, expiry)

    async def get(self, user_id: str) -> str | None:
        return await self.redis.get(user_id)
