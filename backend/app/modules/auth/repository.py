from uuid import uuid4

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.common.repository.base_repository import AbstractCRUDRepository
from app.modules.auth.enums import ProviderEnum, UserRoleEnum
from app.modules.auth.models import User as UserModel
from app.modules.auth.schemas import User as UserSchema


class UserRepository:
    async def get(self, db: AsyncSession, social_id: str, provider: ProviderEnum) -> UserSchema | None:
        select_instance = select(UserModel).where(
            UserModel.social_id == social_id, UserModel.provider == provider.value
        )

        result = await db.execute(select_instance)
        user = result.scalars().first()
        return UserSchema.model_validate(user) if user else None

    async def create(
        self,
        db: AsyncSession,
        social_id: str,
        provider: ProviderEnum,
        role: UserRoleEnum = UserRoleEnum.USER,
        nickname: str = None,
    ) -> UserSchema:
        new_user = UserModel(
            id=uuid4(),
            social_id=social_id,
            provider=provider.value,
            role=role,
            nickname=nickname,
        )

        db.add(
            UserModel(
                id=str(uuid4()),
                social_id=social_id,
                provider=provider.value,
                role=role,
                nickname=nickname,
            )
        )
        await db.commit()
        await db.refresh(new_user)
        return UserSchema.model_validate(new_user)


class RedisJWTTokenRepository(AbstractCRUDRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def save(self, user_id: str, token: str, expiry: int) -> None:
        await self.redis.set(user_id, token)
        await self.redis.expire(user_id, expiry)

    async def get(self, user_id: str) -> str | None:
        return await self.redis.get(user_id)
