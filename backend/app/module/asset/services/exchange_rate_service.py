from redis.asyncio import Redis

from app.module.asset.constant import CURRENCY_PAIRS
from app.module.asset.enum import CurrencyType
from app.module.asset.redis_repository import RedisExchangeRateRepository


class ExchangeRateService:
    @staticmethod
    async def get_exchange_rate_map(redis_client: Redis) -> dict[str, float]:
        result = {}
        keys = [f"{source_currency}_{target_currency}" for source_currency, target_currency in CURRENCY_PAIRS]
        exchange_rates: list[float] = await RedisExchangeRateRepository.bulk_get(redis_client, keys)

        for i, key in enumerate(keys):
            rate = exchange_rates[i]
            result[key] = rate if rate is not None else 0.0
        return result

    @staticmethod
    def get_exchange_rate(source: CurrencyType, target: CurrencyType, exchange_rate_map: dict[str, float]) -> float:
        if source == target:
            return 1.0
        exchange_key = f"{source}_{target}"
        return float(exchange_rate_map.get(exchange_key, 0.0))
