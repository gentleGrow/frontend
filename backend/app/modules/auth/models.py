from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID

from app.common.mixins.timestamps import TimestampMixin
from app.modules.auth.enums import UserRoleEnum
from database.config import PostgresBase


class User(TimestampMixin, PostgresBase):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    social_id = Column(String, index=True, nullable=False)
    provider = Column(String, nullable=False)
    role = Column(Enum(UserRoleEnum), default=UserRoleEnum.user)
    nickname = Column(String, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
