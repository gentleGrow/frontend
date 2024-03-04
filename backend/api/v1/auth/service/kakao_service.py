# Library
from fastapi import HTTPException
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuthError
from httpx import AsyncClient
# Module
from backend.api.v1.auth.service.config_service import oauth

async def fetch_kakao_user_info(access_token: str):
    url = "https://kapi.kakao.com/v2/user/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    async with AsyncClient() as client:
        response = await client.get(url, headers=headers)
        user_info = response.json()
        return user_info

async def authenticate_with_kakao(request: Request):
    try:
        token_response = await oauth.kakao.authorize_access_token(request)
        user_info = await fetch_kakao_user_info(token_response['access_token'])
        
        social_id = user_info.get('id')
        if not social_id:
            raise HTTPException(status_code=400, detail="구글 토큰 내에 유저 고유 ID가 존재하지 않습니다.")
        return social_id
    except OAuthError as error:
        raise HTTPException(status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}")

    
    