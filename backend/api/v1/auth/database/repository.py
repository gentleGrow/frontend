from datetime import datetime
from uuid import uuid4

from sqlalchemy.orm import Session

from api.v1.auth.database.models import User
from api.v1.auth.database.schemas import ProviderEnum, UserRoleEnum


class DBHandler:
    def get_or_create_user(self, db: Session, socialId: str, provider: ProviderEnum):
        user = self.get_user(db, socialId, provider)
        if user is None:
            user = self.create_user(db, socialId, provider)
        return user

    def get_user(self, db: Session, socialId: str, provider: ProviderEnum):
        return (
            db.query(User)
            .filter(User.socialId == socialId, User.provider == provider.value)
            .first()
        )

    def create_user(
        self,
        db: Session,
        socialId: str,
        provider: ProviderEnum,
        role: UserRoleEnum = None,
        nickname: str = None,
    ):
        newUser = User(
            id=uuid4(),
            socialId=socialId,
            provider=provider,
            role=role,
            nickname=nickname,
            created_at=datetime.now(),
        )

        db.add(newUser)
        db.commit()
        db.refresh(newUser)
        return newUser
