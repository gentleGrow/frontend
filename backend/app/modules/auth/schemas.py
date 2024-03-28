from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from app.modules.auth.enums import ProviderEnum, UserRoleEnum


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    social_id: str
    provider: ProviderEnum
    role: UserRoleEnum
    nickname: str | None
    created_at: datetime
    deleted_at: datetime | None

    class Config:
        from_attributes = True


class TokenRequest(BaseModel):
    id_token: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
