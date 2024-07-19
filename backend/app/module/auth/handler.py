from os import getenv

from dotenv import load_dotenv
from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token

from app.common.auth.jwt import JWTBuilder
from app.module.auth.model import User

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


class Google:
    @staticmethod
    async def verify_token(token: str) -> dict:
        try:
            return id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def get_access_token(user: User) -> str:
        return JWTBuilder.generate_access_token(user.id)

    @staticmethod
    async def get_refresh_token(user: User) -> str:
        return JWTBuilder.generate_refresh_token(user.id)
