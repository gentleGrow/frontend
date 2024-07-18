from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.common.repository.base_repository import AbstractCRUDRepository
from app.module.auth.enum import ProviderEnum
from app.module.auth.model import User


class UserRepository:
    @staticmethod
    async def get_by_social_id(session: AsyncSession, social_id: str, provider: ProviderEnum) -> User | None:
        select_instance = select(User).where(User.social_id == social_id, User.provider == provider.value)

        result = await session.execute(select_instance)
        return result.scalars().first()

    @staticmethod
    async def get(session: AsyncSession, user_id: int) -> User | None:
        select_instance = select(User).where(User.id == user_id)
        result = await session.execute(select_instance)
        return result.scalars().first()

    @staticmethod
    async def create(session: AsyncSession, new_user: User) -> User:
        session.add(new_user)
        await session.commit()
        return new_user


class RedisJWTTokenRepository(AbstractCRUDRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def save(self, user_id: str, token: str, expiry: int) -> None:
        await self.redis.set(user_id, token)
        await self.redis.expire(user_id, expiry)

    async def get(self, user_id: str) -> str | None:
        return await self.redis.get(user_id)
