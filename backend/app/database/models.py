# Library
from sqlalchemy import Column, String, Enum, DateTime, null
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

# 모듈
from app.database.config import Base
from app.database.schemas import ProviderEnum, RoleEnum

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    social_id = Column(String, index=True, nullable=False)
    provider = Column(Enum(ProviderEnum))
    role = Column(Enum(RoleEnum))
    nickname = Column(String)
    created_at = Column(DateTime)
    deleted_at = Column(DateTime, nullable=True)

