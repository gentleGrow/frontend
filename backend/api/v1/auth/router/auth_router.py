# Library
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuthError
from sqlalchemy.orm import Session
from starlette.requests import Request
# Module
from api.v1.auth.service.auth_service import AuthenticationBuilder  
from dependencies.dependencies import get_RDB 
from backend.api.v1.auth.service.config_service import oauth

authRouter = APIRouter()
authBuilder = AuthenticationBuilder()

@authRouter.get('/naver', summary='네이버 폼으로 redirect합니다.', description="유저가 카카오 로그인 클릭시, 카카오에서 제공하는 폼으로 이동합니다.")
async def redirect_to_naver_login(request: Request):
    redirect_uri = request.url_for("naver_callback")
    return await oauth.naver.authorize_redirect(request, redirect_uri)

@authRouter.get("/naver/callback", summary="네이버 로그인 작업을 합니다.", description="로그인 심사후 홈페이지로 이동합니다.")
async def naver_callback(request: Request, db: Session = Depends(get_RDB)):
    try:
        await authBuilder.naver_authenticate(db,request)
        return RedirectResponse(url='/', status_code=303)
    except OAuthError as error:
        return {"error": error.description}

@authRouter.get("/kakao", summary="카카오 폼으로 redirect합니다.", description="유저가 카카오 로그인 클릭시, 카카오에서 제공하는 폼으로 이동합니다.")
async def redirect_to_kakao_login(request: Request):
    redirect_uri = request.url_for("kakao_callback")
    return await oauth.kakao.authorize_redirect(request, redirect_uri)

@authRouter.get("/kakao/callback", summary="카카오 로그인 작업을 합니다.", description="로그인 심사후 홈페이지로 이동합니다.")
async def kakao_callback(request: Request, db: Session = Depends(get_RDB)):
    try:
        await authBuilder.kakao_authenticate(db,request)
        return RedirectResponse(url='/', status_code=303)
    except OAuthError as error:
        return {"error": error.description}

@authRouter.get("/google", summary="구글 폼으로 redirect합니다.", description="유저가 구글 로그인 클릭시, 구글에서 제공하는 폼으로 이동합니다.")
async def redirect_to_google_callback(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@authRouter.get("/google/callback", summary='구글 로그인 작업을 합니다.', description='로그인 심사후 홈페이지로 이동합니다.')
async def google_callback(request: Request, db: Session = Depends(get_RDB)):
    try:
        await authBuilder.google_authenticate(db, request)
        return RedirectResponse(url='/', status_code=303)
    except OAuthError as error:
        return {"error": error.description}

