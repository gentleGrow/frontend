from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from app.modules.auth.enums import ProviderEnum, UserRoleEnum


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    socialId: str
    provider: ProviderEnum
    role: UserRoleEnum | None
    nickname: str | None
    created_at: datetime
    deleted_at: datetime | None

    class Config:
        from_attributes = True


class TokenRequest(BaseModel):
    access_token: str = Field(..., description="client에게 전달 받은 구글 access token입니다.")
    refresh_token: str = Field(..., description="client에게 전달 받은 구글 refresh token입니다.")
