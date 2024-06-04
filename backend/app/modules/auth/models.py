from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.orm import relationship

from app.common.mixins.timestamps import TimestampMixin
from app.modules.auth.enums import UserRoleEnum
from database.config import MySQLBase


class User(TimestampMixin, MySQLBase):
    __tablename__ = "user"

    @staticmethod
    def get_uuid():
        return str(uuid4())

    id = Column(String(36), primary_key=True, default=get_uuid)
    social_id = Column(String(255), index=True, nullable=False)
    provider = Column(String(50), nullable=False)
    role = Column(Enum(UserRoleEnum), default=UserRoleEnum.USER)
    nickname = Column(String(100), nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    asset = relationship("Asset", back_populates="user")
