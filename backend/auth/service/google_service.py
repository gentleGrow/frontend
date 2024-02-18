# Library
from fastapi import HTTPException
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuthError
# Module
from auth.service.config import oauth

async def authenticate_with_google(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="구글 로그인이 실패하였습니다.")
        
        social_id = user_info.get('sub')
        return social_id
    except OAuthError as error:
        raise HTTPException(status_code=400, detail=f"OAuth error: {error.error}")
    
