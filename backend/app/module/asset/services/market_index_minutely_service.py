from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import MarketIndex
from app.module.asset.model import MarketIndexMinutely
from app.module.asset.repository.market_index_minutely_repository import MarketIndexMinutelyRepository
from app.module.chart.enum import IntervalType


class MarketIndexMinutelyService:
    @staticmethod
    async def get_index_range_interval_map(
        session: AsyncSession, market_type: MarketIndex, duration: tuple[datetime, datetime], interval: IntervalType
    ) -> dict[datetime, MarketIndexMinutely]:
        market_data: list[MarketIndexMinutely] = await MarketIndexMinutelyRepository.get_by_range_interval_minute(
            session, duration, market_type, interval.get_interval()
        )
        return {market_index.datetime: market_index for market_index in market_data}
