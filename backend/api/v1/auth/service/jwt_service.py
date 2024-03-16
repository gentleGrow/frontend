from datetime import datetime, timedelta
from os import getenv

from dotenv import load_dotenv
from jwt import encode

load_dotenv()
JWT_SECRET_KEY = getenv("JWT_SECRET", None)
JWT_ALGORITHM = getenv("JWT_ALGORITHM", None)
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def generate_jwt(user_id: str, refresh_token: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"exp": expire, "sub": str(user_id)}
    encoded_jwt = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt
