from aredis import StrictRedis
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.common.auth.jwt import JWTBuilder
from app.dependencies.dependencies import get_postgres_session, get_redis_pool
from app.modules.auth.handlers import Google
from app.modules.auth.repository import UserHandler
from app.modules.auth.schemas import TokenRequest, TokenResponse

authRouter = APIRouter()

dbHandler = UserHandler()
jwtBuilder = JWTBuilder()
googleBuilder = Google(dbHandler, jwtBuilder)


@authRouter.post(
    "/google",
    summary="client 구글 token을 확인후 jwt 토큰을 반환합니다.",
    description="client 구글 토큰이 넘어오는 지 확인후, 해당 토큰으로 유저확인을 합니다. 신규 유저인 경우 DB에 저장한후, jwt를 반환합니다.",
    response_model=TokenResponse,
)
async def google_login(
    request: TokenRequest,
    db: Session = Depends(get_postgres_session),
    redis: StrictRedis = Depends(get_redis_pool),
) -> TokenResponse:
    idToken = request.idToken
    if not idToken:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="구글 id token이 넘어오지 않았습니다.",
        )

    try:
        idInfo = await googleBuilder.verifyToken(idToken)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    try:
        token = await googleBuilder.generateToken(db, redis, idInfo)
        return TokenResponse(token=token)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
