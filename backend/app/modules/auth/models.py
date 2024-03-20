from uuid import uuid4

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID

from app.common.mixins.timestamps import TimestampMixin
from app.modules.auth.enums import UserRoleEnum
from database.config import PostgresBase


class User(TimestampMixin, PostgresBase):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    socialId = Column(String, index=True, nullable=False)
    provider = Column(String, nullable=False)
    role = Column(String, default=UserRoleEnum.user)
    nickname = Column(String, nullable=True)
    deletedAt = Column(DateTime, nullable=True)
