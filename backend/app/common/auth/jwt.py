from datetime import datetime, timedelta, timezone
from os import getenv
from typing import Any, Dict

from dotenv import load_dotenv
from fastapi import HTTPException, status
from jwt import ExpiredSignatureError, InvalidTokenError, decode, encode

load_dotenv()
JWT_SECRET_KEY = getenv("JWT_SECRET", None)
JWT_ALGORITHM = getenv("JWT_ALGORITHM", None)
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv("JWT_ACCESS_TIME", "30"))
REFRESH_TOKEN_EXPIRE_MINUTES = int(getenv("JWT_REFRESH_TIME", "300"))


class JWTBuilder:
    def generate_access_token(self, user_id: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {"exp": expire, "sub": str(user_id)}
        result = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return result

    def generate_refresh_token(self, user_id: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        payload = {"exp": expire, "sub": str(user_id)}
        result = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return result

    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            payload = decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="refresh token이 만료되었습니다.")
        except InvalidTokenError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 refresh token입니다.")
