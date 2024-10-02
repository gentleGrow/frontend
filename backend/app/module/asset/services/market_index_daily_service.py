from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import MarketIndex
from app.module.asset.model import MarketIndexDaily
from app.module.asset.repository.market_index_daily_repository import MarketIndexDailyRepository


class MarketIndexDailyService:
    @staticmethod
    async def get_market_index_date_map(session: AsyncSession, duration: tuple[date, date], market_type: MarketIndex):
        market_data: list[MarketIndexDaily] = await MarketIndexDailyRepository.get_by_range(
            session, duration, market_type
        )
        return {market_index.date: market_index for market_index in market_data}
