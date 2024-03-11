# Library
from sqlalchemy.orm import Session
from starlette.requests import Request
from fastapi import HTTPException
from aredis import StrictRedis
from authlib.integrations.starlette_client import OAuthError
# Module
from api.v1.auth.database.schemas import ProviderEnum
from api.v1.auth.service.google_service import verify_google_token
from api.v1.auth.service.kakao_service import authenticate_with_kakao
from api.v1.auth.service.naver_service import authenticate_with_naver
from api.v1.auth.service.jwt_service import generate_jwt
from api.v1.auth.database.repository import DBHandler

# [수정] Strategy Pattern을 활용해, social auth따라 인증합니다.

class AuthenticationBuilder(DBHandler):
    async def google_authenticate(self, db: Session, redis:StrictRedis , access_token:str, refresh_token:str):
        try:
            id_info = await verify_google_token(access_token)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except HTTPException as e:
            raise e
        
        user_info = id_info.get('userinfo')
        social_id = user_info.get('sub')

        user = self.get_or_create_user(db, social_id, ProviderEnum.google)
        jwt_token = generate_jwt(user.id, refresh_token)
        
        await redis.set(f"google_{user.id}", refresh_token, ex=3600)

        return jwt_token
    
    
    async def naver_authenticate(self, db:Session, request: Request):
        try:
            social_id = await authenticate_with_naver(request)
        except HTTPException as e:
            raise e
        except OAuthError as error:
            raise HTTPException(status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}")

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
            raise HTTPException(status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}")

        social_id = str(social_id)
        user = self.get_user(db, social_id, ProviderEnum.kakao)
        if user is None:
            user = self.create_user(db, social_id, ProviderEnum.kakao)
        return user

