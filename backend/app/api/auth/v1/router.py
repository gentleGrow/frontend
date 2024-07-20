from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.auth.constant import REDIS_JWT_REFRESH_EXPIRE_TIME_SECOND
from app.module.auth.enum import ProviderEnum
from app.module.auth.jwt import JWTBuilder
from app.module.auth.model import User
from app.module.auth.repository import UserRepository
from app.module.auth.schema import AccessTokenResponse, TokenRefreshRequest, TokenRequest, TokenResponse
from app.module.auth.service import Google
from database.dependency import get_router_sql_session
from database.redis import redis_repository

auth_router = APIRouter(prefix="/v1")


@auth_router.post(
    "/google",
    summary="client 구글 token을 확인후 jwt 토큰을 반환합니다.",
    description="client 구글 토큰이 넘어오는 지 확인후, 해당 토큰으로 유저확인을 합니다. 신규 유저인 경우 DB에 저장한후, jwt를 반환합니다.",
    response_model=TokenResponse,
)
async def google_login(request: TokenRequest, session: AsyncSession = Depends(get_router_sql_session)) -> TokenResponse:
    id_token = request.id_token
    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="구글 id token이 넘어오지 않았습니다.",
        )

    try:
        id_info = await Google.verify_token(id_token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    social_id = id_info.get("sub")
    if social_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="id token에 유저 정보가 없습니다.")

    user = await UserRepository.get_by_social_id(session, social_id, ProviderEnum.GOOGLE)
    if user is None:
        user = User(
            social_id=social_id,
            provider=ProviderEnum.GOOGLE.value,
        )
        user = await UserRepository.create(session, user)

    access_token = JWTBuilder.generate_access_token(user.id)
    refresh_token = JWTBuilder.generate_refresh_token(user.id)

    user_string_id = str(user.id)
    await redis_repository.save(user_string_id, refresh_token, REDIS_JWT_REFRESH_EXPIRE_TIME_SECOND)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@auth_router.post(
    "/refresh",
    summary="새로운 JWT 액세스 토큰을 발급합니다.",
    description="클라이언트로부터 유저 ID를 받아, Redis에서 해당 유저의 리프레시 토큰을 검색 후, 새로운 액세스 토큰을 발급하여 반환합니다.",
    response_model=AccessTokenResponse,
)
async def refresh_access_token(request: TokenRefreshRequest) -> AccessTokenResponse:
    refresh_token = request.refresh_token
    decoded = JWTBuilder.decode_token(refresh_token)
    user_id = decoded.get("sub")

    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="refresh token안에 유저 정보가 들어있지 않습니다.")

    stored_refresh_token = await redis_repository.get(user_id)

    if stored_refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="서버에 저장된 refresh token이 없습니다.",
        )

    if stored_refresh_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="서버에 저장된 refresh token과 다른 refresh token을 반환하였습니다.",
        )

    access_token = JWTBuilder.generate_access_token(user_id)

    return AccessTokenResponse(access_token=access_token)
