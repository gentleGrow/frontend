# Library
from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
import enum
import uuid
# Module
from app.database.config import Base

class ProviderEnum(enum.Enum):
    google = "google"
    facebook = "facebook"
    twitter = "twitter"

class RoleEnum(enum.Enum):
    admin = "admin"
    user = "user"
    guest = "guest"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    social_id = Column(String, index=True)
    provider = Column(Enum(ProviderEnum))
    role = Column(Enum(RoleEnum))
    nickname = Column(String)
    created_at = Column(DateTime)
    deleted_at = Column(DateTime)

