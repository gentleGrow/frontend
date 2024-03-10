# Library
from google.oauth2 import id_token
from google.auth.transport import requests
from os import getenv
from dotenv import load_dotenv
# Module
from api.v1.auth.service.config_service import oauth

load_dotenv()
GOOGLE_CLIENT_ID = getenv('GOOGLE_CLIENT_ID', None)

async def verify_google_token(access_token: str):
    try:
        id_info = id_token.verify_oauth2_token(access_token, requests.Request(), GOOGLE_CLIENT_ID)
        return id_info
    except ValueError:
        raise ValueError("Token is invalid or expired.")


# from fastapi import HTTPException
# from starlette.requests import Request
# from authlib.integrations.starlette_client import OAuthError

# async def verify_google_token(request: Request):
#     try:
#         token = await oauth.google.authorize_access_token(request)
#         user_info = token.get('userinfo')
        
#         if not user_info:
#             raise HTTPException(status_code=400, detail="구글 토큰 내에 유저 고유 ID가 존재하지 않습니다.")
        
#         social_id = user_info.get('sub')
        
#         return social_id
#     except OAuthError as error:
#         raise HTTPException(status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}")