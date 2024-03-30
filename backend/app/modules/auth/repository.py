from abc import ABC, abstractmethod
from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from redis import Redis
from sqlalchemy.orm import Session

from app.modules.auth.enums import ProviderEnum, UserRoleEnum
from app.modules.auth.models import User as UserModel
from app.modules.auth.schemas import User as UserSchema


class AbstractTokenRepository(ABC):
    @abstractmethod
    async def save(self, token_key: str, jwt_token: str, expiry: int) -> None:
        pass

    @abstractmethod
    async def get(self, token_key: str) -> str | None:
        pass


class RedisTokenRepository(AbstractTokenRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def save(self, user_id: str, token: str, expiry: int) -> None:
        self.redis.set(user_id, token)
        self.redis.expire(user_id, expiry)

    async def get(self, user_id: str) -> str | None:
        token = await self.redis.get(user_id)
        return token


class UserRepository:
    def get(self, db: Session, social_id: str, provider: ProviderEnum) -> UserSchema | None:
        result = (
            db.query(UserModel).filter(UserModel.social_id == social_id, UserModel.provider == provider.value).first()
        )

        return UserSchema.model_validate(result) if result is not None else None

    def create(
        self,
        db: Session,
        social_id: str,
        provider: ProviderEnum,
        role: UserRoleEnum = None,
        nickname: str = None,
    ) -> UserSchema:
        new_user = UserModel(
            id=uuid4(),
            social_id=social_id,
            provider=provider,
            role=role,
            nickname=nickname,
            created_at=datetime.now(),
        )

        if new_user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="유저 생성에 실패하였습니다.")

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return UserSchema.model_validate(new_user)
