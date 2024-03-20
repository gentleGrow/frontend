from abc import ABC, abstractmethod
from os import getenv

from aredis import StrictRedis
from dotenv import load_dotenv
from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.modules.auth.enums import ProviderEnum

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


class SocialLoginAuthentication(ABC):
    def __init__(self, dbHandler, tokenBuilder):
        self.dbHandler = dbHandler
        self.tokenBuilder = tokenBuilder

    @abstractmethod
    async def verifyToken(self, accessToken: str):
        raise NotImplementedError("authenticate method is not implemented.")

    @abstractmethod
    async def generateToken(self, db: Session, redis: StrictRedis, idInfo: dict):
        raise NotImplementedError("authenticate method is not implemented.")


class Google(SocialLoginAuthentication):
    def __init__(self, dbHandler, tokenBuilder):
        self.dbHandler = dbHandler
        self.tokenBuilder = tokenBuilder

    async def verifyToken(self, idToken: str) -> dict:
        try:
            idInfo = id_token.verify_oauth2_token(
                idToken, requests.Request(), GOOGLE_CLIENT_ID
            )
            return idInfo
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def generateToken(self, db: Session, redis: StrictRedis, idInfo: dict) -> str:
        socialId = idInfo.get("sub")

        user = self.dbHandler.get(db, socialId, ProviderEnum.google)
        if user is None:
            try:
                user = self.dbHandler.create(db, socialId, ProviderEnum.google)
            except HTTPException as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
                )

        jwtToken = self.tokenBuilder.generate(user.id)

        return jwtToken
