from redis.asyncio import Redis

from app.module.asset.enum import MarketIndex
from app.module.asset.schema import MarketIndexData
from app.module.chart.redis_repository import RedisMarketIndiceRepository


class CurrentIndexService:
    @staticmethod
    async def get_current_index_price(redis_client: Redis, market_type: MarketIndex) -> float:
        curent_index: MarketIndexData = await RedisMarketIndiceRepository.get(redis_client, market_type)
        return float(curent_index["current_value"]) if curent_index else 1.0
