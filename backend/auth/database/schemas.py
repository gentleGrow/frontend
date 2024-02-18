# Library
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from uuid import uuid4, UUID
# Module
from auth.database.config import Base

class ProviderEnum(str, Enum):
    google = "google"
    kakao = "kakao"
    naver = "naver"

class UserRoleEnum(str, Enum):
    admin = "admin"
    user = "user"

class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    social_id: str 
    provider: ProviderEnum 
    role: UserRoleEnum | None
    nickname: str | None
    created_at: datetime
    deleted_at: datetime | None

    #[정보] Config을 통해서 DB 데이터의 직렬화/비직렬화를 설정합니다. 이를 통해 직접 db에서 endpoint까지 데이터 변환 과정없이 전달이 가능합니다.
    class Config:
        from_attributes = True
            

