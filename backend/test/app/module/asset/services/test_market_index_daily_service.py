from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.enum import MarketIndex
from app.module.asset.services.market_index_daily_service import MarketIndexDailyService
from app.module.asset.model import MarketIndexDaily
from icecream import ic

class TestMarketIndexDailyService:
    async def test_get_market_index_date_map(
        self,
        setup_all,
        session: AsyncSession
    ):
        # Given
        start_date = date(2024, 8, 13)
        end_date = date(2024, 8, 15)


        # When
        result = await MarketIndexDailyService.get_market_index_date_map(
            session=session,
            duration=(start_date, end_date),
            market_type=MarketIndex.KOSPI  
        )

        # Then
        assert result[start_date].close_price == 3200.0
        assert result[end_date].close_price == 3300.0