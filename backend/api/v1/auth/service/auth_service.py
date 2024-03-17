from aredis import StrictRedis
from authlib.integrations.starlette_client import OAuthError
from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette.requests import Request

from api.v1.auth.database.repository import DBHandler
from api.v1.auth.database.schemas import ProviderEnum
from api.v1.auth.service.google_service import verify_google_token
from api.v1.auth.service.jwt_service import generate_jwt
from api.v1.auth.service.kakao_service import authenticate_with_kakao
from api.v1.auth.service.naver_service import authenticate_with_naver


class AuthenticationBuilder(DBHandler):
    async def google_authenticate(
        self, db: Session, redis: StrictRedis, accessToken: str, refreshToken: str
    ):
        try:
            idInfo = await verify_google_token(accessToken)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except HTTPException as e:
            raise e

        userInfo = idInfo.get("userinfo")
        socialId = userInfo.get("sub")

        user = self.get_or_create_user(db, socialId, ProviderEnum.google)
        jwtToken = generate_jwt(user.id, refreshToken)

        await redis.set(f"google_{user.id}", refreshToken, ex=3600)

        return jwtToken

    async def naver_authenticate(self, db: Session, request: Request):
        try:
            socialId = await authenticate_with_naver(request)
        except HTTPException as e:
            raise e
        except OAuthError as error:
            raise HTTPException(
                status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}"
            )

        socialId = str(socialId)

        user = self.get_user(db, socialId, ProviderEnum.naver)
        if user is None:
            user = self.create_user(db, socialId, ProviderEnum.naver)
        return user

    async def kakao_authenticate(self, db: Session, request: Request):
        try:
            socialId = await authenticate_with_kakao(request)
        except HTTPException as e:
            raise e
        except OAuthError as error:
            raise HTTPException(
                status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}"
            )

        socialId = str(socialId)
        user = self.get_user(db, socialId, ProviderEnum.kakao)
        if user is None:
            user = self.create_user(db, socialId, ProviderEnum.kakao)
        return user
