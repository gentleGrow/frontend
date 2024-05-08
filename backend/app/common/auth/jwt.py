from datetime import datetime, timedelta, timezone
from os import getenv
from typing import Any

from dotenv import load_dotenv
from fastapi import HTTPException, status
from jwt import ExpiredSignatureError, InvalidTokenError, decode, encode

from app.common.auth.constants import JWT_ACCESS_TIME_MINUTE, JWT_REFRESH_TIME_MINUTE

load_dotenv()
JWT_SECRET_KEY = getenv("JWT_SECRET", None)
JWT_ALGORITHM = getenv("JWT_ALGORITHM", None)


class JWTBuilder:
    def generate_access_token(self, user_id: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_ACCESS_TIME_MINUTE)
        payload = {"exp": expire, "sub": str(user_id)}
        result = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return result

    def generate_refresh_token(self, user_id: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_REFRESH_TIME_MINUTE)
        payload = {"exp": expire, "sub": str(user_id)}
        result = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return result

    def decode_token(self, token: str) -> dict[str, Any]:
        try:
            payload = decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="refresh token이 만료되었습니다.")
        except InvalidTokenError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 refresh token입니다.")
