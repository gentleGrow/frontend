from datetime import datetime, timedelta, timezone
from os import getenv

from dotenv import load_dotenv
from jwt import encode

load_dotenv()
JWT_SECRET_KEY = getenv("JWT_SECRET", None)
JWT_ALGORITHM = getenv("JWT_ALGORITHM", None)
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv("JWT_ACCESS_TIME", "30"))
REFRESH_TOKEN_EXPIRE_MINUTES = int(getenv("JWT_REFRESH_TIME", "300"))


class JWTBuilder:
    def generate_access_token(self, user_id: str):
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {"exp": expire, "sub": str(user_id)}
        result = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return result

    def generate_refresh_token(self, user_id: str):
        expire = datetime.now(timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        payload = {"exp": expire, "sub": str(user_id)}
        result = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return result
