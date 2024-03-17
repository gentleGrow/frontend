from aredis import StrictRedis
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from api.v1.auth.database.schemas import TokenRequest
from api.v1.auth.service.auth_service import AuthenticationBuilder
from dependencies.dependencies import get_postgres_session, get_redis_pool

authRouter = APIRouter()
authBuilder = AuthenticationBuilder()


@authRouter.post(
    "/google",
    summary="client 구글 token을 확인후 jwt 토큰을 반환합니다.",
    description="client 구글 토큰이 넘어오는 지 확인후, 해당 토큰으로 유저확인을 합니다. 신규 유저인 경우 DB에 저장한후, jwt를 반환합니다.",
)
async def google_login(
    request: TokenRequest,
    db: Session = Depends(get_postgres_session),
    redis: StrictRedis = Depends(get_redis_pool),
):
    accessToken = request.accessToken
    refreshToken = request.refreshToken

    if not accessToken:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"Message": "구글 access token이 넘어오지 않았습니다."},
        )

    if not refreshToken:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"Message": "구글 refresh token이 넘어오지 않았습니다."},
        )

    try:
        jwtToken = await authBuilder.google_authenticate(
            db, redis, accessToken, refreshToken
        )

        return jwtToken
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"message": e.detail})
