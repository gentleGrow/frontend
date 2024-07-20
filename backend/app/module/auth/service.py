from os import getenv

from dotenv import load_dotenv
from google.auth.transport import requests
from google.oauth2 import id_token

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


class Google:
    @staticmethod
    async def verify_token(token: str) -> dict:
        try:
            return id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        except ValueError as e:
            raise ValueError(str(e))
