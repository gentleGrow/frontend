from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class ProviderEnum(str, Enum):
    google = "google"
    kakao = "kakao"
    naver = "naver"


class UserRoleEnum(str, Enum):
    admin = "admin"
    user = "user"


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
