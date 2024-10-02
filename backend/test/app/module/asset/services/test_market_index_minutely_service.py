from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.enum import MarketIndex
from app.module.chart.enum import IntervalType
from app.module.asset.services.market_index_minutely_service import MarketIndexMinutelyService
from app.module.asset.model import MarketIndexMinutely

class TestMarketIndexMinutelyService:
    async def test_get_index_range_interval_map(
        self,
        session: AsyncSession,
        setup_all
    ):
        # Given
        market_type = MarketIndex.KOSPI
        interval = IntervalType.FIVEDAY
        end_date = datetime(2024, 8, 15, 23, 59)
        start_date = end_date - timedelta(days=4)

        # When
        result = await MarketIndexMinutelyService.get_index_range_interval_map(
            session, market_type, (start_date, end_date), interval
        )

        # Then
        assert all(isinstance(value, MarketIndexMinutely) for value in result.values())  

        times = list(result.keys())
        for i in range(1, len(times)):
            assert (times[i] - times[i - 1]).total_seconds() == interval.get_interval() * 60
