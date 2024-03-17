from os import getenv

from dotenv import load_dotenv
from google.auth.transport import requests
from google.oauth2 import id_token

load_dotenv()
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)


async def verify_google_token(accessToken: str):
    try:
        idInfo = id_token.verify_oauth2_token(
            accessToken, requests.Request(), GOOGLE_CLIENT_ID
        )
        return idInfo
    except ValueError:
        raise ValueError("Token is invalid or expired.")
