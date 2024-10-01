from redis.asyncio import Redis
from app.module.asset.services.current_index_service import CurrentIndexService
from app.module.asset.enum import MarketIndex
from icecream import ic


class TestCurrentIndexService:
    async def test_get_current_index_price(
        self,
        redis_client: Redis,
        setup_all,
    ):
        # Given
        market_type = MarketIndex.KOSPI

        # When
        result = await CurrentIndexService.get_current_index_price(redis_client, market_type)
      
        # Then
        assert result == 3250.0  

    async def test_get_current_index_price_no_data(
        self,
        redis_client: Redis,
        setup_all
    ):
        # Given
        market_type = MarketIndex.DOW_JONES

        # When
        result = await CurrentIndexService.get_current_index_price(redis_client, market_type)

        # Then
        assert result == 1.0
