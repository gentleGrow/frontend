from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from app.modules.auth.enums import ProviderEnum, UserRoleEnum


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    socialId: str
    provider: ProviderEnum
    role: UserRoleEnum
    nickname: str | None
    createdAt: datetime
    deletedAt: datetime | None

    class Config:
        from_attributes = True


class TokenRequest(BaseModel):
    idToken: str


class TokenResponse(BaseModel):
    token: str
