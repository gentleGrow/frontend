# Library
from sqlalchemy.orm import Session
from starlette.requests import Request
from fastapi import HTTPException
from authlib.integrations.starlette_client import OAuthError
from uuid import uuid4
from datetime import datetime
# Module
from auth.database.models import User
from auth.database.schemas import ProviderEnum, UserRoleEnum
from auth.service.google_service import authenticate_with_google
from auth.service.kakao_service import authenticate_with_kakao
from auth.service.naver_service import authenticate_with_naver


class DBHandler():
    def get_user(self, db: Session, social_id: str, provider: ProviderEnum):
        return db.query(User).filter(User.social_id == social_id, User.provider == provider.value).first()

    def create_user(self, db: Session, social_id: str, provider: ProviderEnum, role: UserRoleEnum=None, nickname: str=None):
        new_user = User(
                id=uuid4(),  
                social_id=social_id,
                provider=provider,
                role=role,
                nickname=nickname,
                created_at=datetime.now()  
            )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)  
        return new_user

class AuthenticationBuilder(DBHandler):
    async def naver_authenticate(self, db:Session, request: Request):
        try:
            social_id = await authenticate_with_naver(request)
        except HTTPException as e:
            raise e
        except OAuthError as error:
            raise HTTPException(status_code=400, detail=f"OAuth error: {error.error}")

        social_id = str(social_id)
        user = self.get_user(db, social_id, ProviderEnum.naver)
        if user is None:
            user = self.create_user(db, social_id, ProviderEnum.naver)
        return user
    
    async def kakao_authenticate(self, db:Session, request: Request):
        try:
            social_id = await authenticate_with_kakao(request)
        except HTTPException as e:
            raise e
        except OAuthError as error:
            raise HTTPException(status_code=400, detail=f"OAuth error: {error.error}")

        social_id = str(social_id)
        user = self.get_user(db, social_id, ProviderEnum.kakao)
        if user is None:
            user = self.create_user(db, social_id, ProviderEnum.kakao)
        return user
    
    async def google_authenticate(self, db: Session, request: Request):
        try:
            user_info = await authenticate_with_google(request)
        except HTTPException as e:
            raise e
        except OAuthError as error:
            raise HTTPException(status_code=400, detail=f"OAuth error: {error.error}")

        social_id = user_info.get('sub')
        
        user = self.get_user(db, social_id, ProviderEnum.google)
        if user is None:
            user = self.create_user(db, social_id, ProviderEnum.google)
        return user
