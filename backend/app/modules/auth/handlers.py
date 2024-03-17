from aredis import StrictRedis
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.common.auth.jwt import generate_jwt
from app.modules.auth.enums import ProviderEnum
from app.modules.auth.repository import DBHandler
from app.modules.auth.service.google import verify_google_token


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
