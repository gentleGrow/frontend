from abc import ABC, abstractmethod
from os import getenv

from dotenv import load_dotenv
from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.modules.auth.enums import ProviderEnum

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


class SocialLoginAuthentication(ABC):
    def __init__(self, db_handler, token_builder, cache_db_handler):
        self.db_handler = db_handler
        self.token_builder = token_builder
        self.cache_db_handler = cache_db_handler

    @abstractmethod
    async def verify_token(self, access_token: str):
        raise NotImplementedError("authenticate method is not implemented.")

    @abstractmethod
    async def get_access_token(self, db: Session, social_id: str):
        raise NotImplementedError("authenticate method is not implemented.")

    @abstractmethod
    async def get_refresh_token(self, db: Session, social_id: str):
        raise NotImplementedError("authenticate method is not implemented.")


class Google(SocialLoginAuthentication):
    def __init__(self, db_repository, token_builder):
        self.db_repository = db_repository
        self.token_builder = token_builder

    async def verify_token(self, token: str) -> dict:
        try:
            id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
            return id_info
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def get_access_token(self, db: Session, social_id: str) -> str:
        user = self.db_repository.get(db, social_id, ProviderEnum.google)
        if user is None:
            try:
                user = self.db_repository.create(db, social_id, ProviderEnum.google)
            except HTTPException as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        try:
            result = self.token_builder.generate_access_token(user.id)
        except HTTPException as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

        return result

    async def get_refresh_token(self, db: Session, social_id: str) -> str:
        user = self.db_repository.get(db, social_id, ProviderEnum.google)
        try:
            result = self.token_builder.generate_refresh_token(user.id)
        except HTTPException as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        return result
