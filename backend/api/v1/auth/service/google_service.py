# Library
from fastapi import HTTPException
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuthError
# Module
from api.v1.auth.service.config import oauth

async def authenticate_with_google(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(status_code=400, detail="구글 토큰 내에 유저 고유 ID가 존재하지 않습니다.")
        
        social_id = user_info.get('sub')
        
        return social_id
    except OAuthError as error:
        raise HTTPException(status_code=400, detail=f"OAuth 에러가 발생하였습니다 : {error.error}")
    
