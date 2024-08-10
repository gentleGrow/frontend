import asyncio

import yfinance

from app.data.common.constant import STOCK_CACHE_SECOND
from app.module.asset.constant import currency_pairs
from database.redis import redis_repository


async def fetch_exchange_rate(source_currency: str, target_currency: str) -> float | None:
    url = f"{source_currency}{target_currency}=X"
    try:
        ticker = yfinance.Ticker(url)
    except Exception:
        return None
    else:
        exchange_rate_history = ticker.history(period="1d")
        if not exchange_rate_history.empty:
            rate = exchange_rate_history["Close"].iloc[0]
            return rate
    return None


async def main():
    while True:
        for source_currency, target_currency in currency_pairs:
            rate = await fetch_exchange_rate(source_currency, target_currency)

            if rate is None:
                continue

            cache_key = source_currency + "_" + target_currency

            await redis_repository.save(cache_key, rate, expire_time=STOCK_CACHE_SECOND)


if __name__ == "__main__":
    asyncio.run(main())
