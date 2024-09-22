from redis.asyncio import Redis
from app.module.asset.services.exchange_rate_service import ExchangeRateService

class TestExchangeRateService:
    async def test_get_exchange_rate_map(
        self,
        redis_client: Redis,
        setup_exchange_rate
    ):
        # Given
        expected_keys, expected_values = setup_exchange_rate
        
        # When
        exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)
        
        # Then
        for key, value in zip(expected_keys, expected_values):
            assert exchange_rate_map[key] == float(value)
        