from datetime import date, datetime

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.chart.enum import IntervalType
from app.module.chart.facade.performance_analysis_facade import PerformanceAnalysisFacade


class TestPerformanceAnalysisFacade:
    async def test_get_market_analysis(
        self, session: AsyncSession, redis_client: Redis, setup_current_index, setup_market_index_daily
    ):
        # Given
        interval_start = date(2024, 8, 10)
        interval_end = date(2024, 8, 11)

        # When
        result = await PerformanceAnalysisFacade.get_market_analysis(
            session=session,
            redis_client=redis_client,
            start_date=interval_start,
            end_date=interval_end,
        )

        # Then
        expected_result = {
            date(2024, 8, 11): ((3200.0 - 3150.0) / 3150.0) * 100,
        }

        assert result == expected_result

    async def test_get_market_analysis_short(
        self, session: AsyncSession, redis_client: Redis, setup_current_index, setup_market_index_minutely
    ):
        # Given
        interval_start = datetime(2024, 9, 24, 21, 30)
        interval_end = datetime(2024, 9, 24, 23, 30)
        interval_minutes = IntervalType.FIVEDAY

        # When
        result = await PerformanceAnalysisFacade.get_market_analysis_short(
            session=session,
            redis_client=redis_client,
            interval_start=interval_start,
            interval_end=interval_end,
            interval=interval_minutes,
        )

        # Then
        expected_result = {
            datetime(2024, 9, 24, 21, 30): ((3200.0 - 3100.0) / 3100.0) * 100,
            datetime(2024, 9, 24, 22, 0): ((3200.0 - 3100.0) / 3100.0) * 100,
            datetime(2024, 9, 24, 22, 30): ((3200.0 - 3150.0) / 3150.0) * 100,
            datetime(2024, 9, 24, 23, 0): ((3200.0 - 3150.0) / 3150.0) * 100,
            datetime(2024, 9, 24, 23, 30): ((3200.0 - 3150.0) / 3150.0) * 100,
        }

        assert result == expected_result
