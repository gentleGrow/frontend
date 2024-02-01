from pydantic import BaseModel
from datetime import datetime
import uuid
import enum

class ProviderEnum(str, enum.Enum):
    google = "google"
    kakao = "kakao"
    naver = "naver"

class RoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"
    guest = "guest"

class User(BaseModel):
    social_id: str 
    provider: ProviderEnum
    role: RoleEnum
    nickname: str | None

    #[정보] Config을 통해서 DB 데이터의 직렬화/비직렬화를 설정합니다. 이를 통해 직접 db에서 endpoint까지 데이터 변환 과정없이 전달이 가능합니다.
    class Config:
            orm_mode = True
            
class UserCreate(User):
    created_at: datetime | None

