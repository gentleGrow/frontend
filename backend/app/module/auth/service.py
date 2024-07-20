from os import getenv

import httpx
from dotenv import load_dotenv
from fastapi import status
from google.auth.transport import requests
from google.oauth2 import id_token

load_dotenv()

GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", None)

KAKAO_TOKEN_INFO_URL = getenv("KAKAO_TOKEN_INFO_URL", None)


class Kakao:
    @staticmethod
    async def verify_token(id_token: str) -> dict:
        data = {"id_token": id_token}
        headers = {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
        async with httpx.AsyncClient() as client:
            response = await client.post(KAKAO_TOKEN_INFO_URL, data=data, headers=headers)
            if response.status_code is not status.HTTP_200_OK:
                error_response = response.json()
                raise ValueError(error_response.get("error_description"))
            else:
                return response.json()


class Google:
    @staticmethod
    async def verify_token(token: str) -> dict:
        try:
            return id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        except ValueError as e:
            raise ValueError(str(e))
