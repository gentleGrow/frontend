from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID

from api.v1.auth.database.schemas import UserRoleEnum
from database.config import PostgresBase


class User(PostgresBase):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    social_id = Column(String, index=True, nullable=False)
    provider = Column(String, nullable=False)
    role = Column(Enum(UserRoleEnum), nullable=True)
    nickname = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
