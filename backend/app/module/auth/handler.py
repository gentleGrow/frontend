from abc import ABC, abstractmethod
from os import getenv

from dotenv import load_dotenv
from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token

from app.common.auth.jwt import JWTBuilder
from app.module.auth.repository import UserRepository
from app.module.auth.schema import User as UserSchema

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


class SocialLoginAuthentication(ABC):
    def __init__(self, db_handler, token_builder):
        self.db_handler = db_handler
        self.token_builder = token_builder

    @abstractmethod
    async def verify_token(self, access_token: str):
        raise NotImplementedError("인증 method가 적용되어 있지 않습니다.")

    @abstractmethod
    async def get_access_token(self, user: UserSchema):
        raise NotImplementedError("인증 method가 적용되어 있지 않습니다.")

    @abstractmethod
    async def get_refresh_token(self, user: UserSchema):
        raise NotImplementedError("인증 method가 적용되어 있지 않습니다.")


class Google(SocialLoginAuthentication):
    def __init__(self, user_repository: UserRepository, token_builder: JWTBuilder):
        self.user_repository = user_repository
        self.token_builder = token_builder

    async def verify_token(self, token: str) -> dict:
        try:
            return id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def get_access_token(self, user: UserSchema) -> str:
        return self.token_builder.generate_access_token(user.id)

    async def get_refresh_token(self, user: UserSchema) -> str:
        return self.token_builder.generate_refresh_token(user.id)
