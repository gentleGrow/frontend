from fastapi import HTTPException, Security
from fastapi.security import OAuth2PasswordBearer

from app.common.auth.jwt import JWTBuilder

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
jwt_builder = JWTBuilder()


def verify_jwt_token(token: str = Security(oauth2_scheme)) -> str:
    try:
        jwt_builder.decode_token(token)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    return token
