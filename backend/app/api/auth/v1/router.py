from fastapi import APIRouter, Depends, HTTPException, status
from redis import Redis
from sqlalchemy.orm import Session

from app.common.auth.constants import REDIS_EXPIRE_TIME
from app.common.auth.jwt import JWTBuilder
from app.dependencies.dependencies import get_postgres_session, get_redis_pool
from app.modules.auth.enums import ProviderEnum
from app.modules.auth.handlers import Google
from app.modules.auth.repository import RedisTokenRepository, UserRepository
from app.modules.auth.schemas import TokenRefreshRequest, TokenRequest, TokenResponse

auth_router = APIRouter()
user_repository = UserRepository()
jwt_builder = JWTBuilder()
google_builder = Google(user_repository, jwt_builder)


@auth_router.post(
    "/google",
    summary="client 구글 token을 확인후 jwt 토큰을 반환합니다.",
    description="client 구글 토큰이 넘어오는 지 확인후, 해당 토큰으로 유저확인을 합니다. 신규 유저인 경우 DB에 저장한후, jwt를 반환합니다.",
    response_model=TokenResponse,
)
async def google_login(
    request: TokenRequest,
    db: Session = Depends(get_postgres_session),
    redis: Redis = Depends(get_redis_pool),
) -> TokenResponse:
    id_token = request.id_token
    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="구글 id token이 넘어오지 않았습니다.",
        )

    try:
        id_info = await google_builder.verify_token(id_token)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    social_id = id_info.get("sub")
    if social_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="인증되지 않은 유저입니다.")

    try:
        access_token = await google_builder.get_access_token(db, social_id)
        refresh_token = await google_builder.get_refresh_token(db, social_id)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    user = user_repository.get(db, social_id, ProviderEnum.google)
    if user is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="유저가 정상적으로 생성되지 않았습니다.")

    try:
        redis_handler = RedisTokenRepository(redis)
        user_string_id = str(user.id)
        await redis_handler.save(user_string_id, refresh_token, REDIS_EXPIRE_TIME)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@auth_router.post(
    "/refresh",
    summary="새로운 JWT 액세스 토큰을 발급합니다.",
    description="클라이언트로부터 유저 ID를 받아, Redis에서 해당 유저의 리프레시 토큰을 검색 후, 새로운 액세스 토큰을 발급하여 반환합니다.",
    response_model=TokenResponse,
)
async def refresh_access_token(
    request: TokenRefreshRequest,
    redis: Redis = Depends(get_redis_pool),
) -> TokenResponse:
    refresh_token = request.refresh_token
    try:
        decoded = jwt_builder.decode_token(refresh_token)
        user_id = decoded.get("sub")

        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="refresh token안에 유저 정보가 들어있지 않습니다.")
    except HTTPException as e:
        raise e

    redis_repository = RedisTokenRepository(redis)
    stored_refresh_token = redis_repository.get(user_id)
    if stored_refresh_token is None or stored_refresh_token != refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="서버에 저장된 refresh token이 없습니다.",
        )

    access_token = jwt_builder.generate_access_token(user_id)

    return TokenResponse(access_token=access_token)
