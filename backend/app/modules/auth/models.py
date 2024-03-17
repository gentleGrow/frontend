from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID

from app.modules.auth.enums import UserRoleEnum
from database.config import PostgresBase


class User(PostgresBase):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    socialId = Column(String, index=True, nullable=False)
    provider = Column(String, nullable=False)
    role = Column(Enum(UserRoleEnum), nullable=True)
    nickname = Column(String, nullable=True)
    createdAt = Column(DateTime, nullable=False)
    deletedAt = Column(DateTime, nullable=True)
