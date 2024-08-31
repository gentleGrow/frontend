from fastapi import APIRouter, Depends, HTTPException, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.module.auth.schema import AccessToken
from app.module.chart.constant import TIP_TODAY_ID_REDIS_KEY
from app.module.chart.redis_repository import RedisTipRepository
from app.module.chart.repository import TipRepository
from app.module.chart.schema import ChartTipResponse
from database.dependency import get_mysql_session_router, get_redis_pool

chart_router = APIRouter(prefix="/v1")


@chart_router.get("/tip", summary="오늘의 투자 tip", response_model=ChartTipResponse)
async def get_today_tip(
    token: AccessToken = Depends(verify_jwt_token),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> ChartTipResponse:
    today_tip_id = await RedisTipRepository.get(redis_client, TIP_TODAY_ID_REDIS_KEY)

    if today_tip_id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="오늘의 팁 id가 캐싱되어 있지 않습니다.")

    invest_tip = await TipRepository.get(session, int(today_tip_id))

    if invest_tip is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="오늘의 팁 데이터가 존재하지 않습니다.")

    return ChartTipResponse(today_tip=invest_tip.tip)
