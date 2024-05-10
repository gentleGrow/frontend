from fastapi import Security
from fastapi.security import OAuth2PasswordBearer

from app.common.auth.jwt import JWTBuilder

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
jwt_builder = JWTBuilder()


def verify_jwt_token(token: str = Security(oauth2_scheme)) -> str:
    jwt_builder.decode_token(token)
    return token
