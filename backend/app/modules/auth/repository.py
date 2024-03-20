from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.auth.enums import ProviderEnum, UserRoleEnum
from app.modules.auth.models import User as UserModel
from app.modules.auth.schemas import User as UserSchema


class UserHandler:
    def get(
        self, db: Session, socialId: str, provider: ProviderEnum
    ) -> UserSchema | None:
        result = (
            db.query(UserModel)
            .filter(
                UserModel.socialId == socialId, UserModel.provider == provider.value
            )
            .first()
        )

        if result is None:
            return None
        return UserSchema.model_validate(result)

    def create(
        self,
        db: Session,
        socialId: str,
        provider: ProviderEnum,
        role: UserRoleEnum = None,
        nickname: str = None,
    ) -> UserSchema:
        newUser = UserModel(
            id=uuid4(),
            socialId=socialId,
            provider=provider,
            role=role,
            nickname=nickname,
            createdAt=datetime.now(),
        )

        if newUser is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="유저 생성에 실패하였습니다."
            )

        db.add(newUser)
        db.commit()
        db.refresh(newUser)
        return UserSchema.model_validate(newUser)
