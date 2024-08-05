from typing import Any

from fastapi import Security
from fastapi.security import OAuth2PasswordBearer

from app.module.auth.jwt import JWTBuilder

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_jwt_token(token: str = Security(oauth2_scheme)) -> dict[str, Any]:
    return JWTBuilder.decode_token(token)
