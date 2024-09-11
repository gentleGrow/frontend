import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from zoneinfo import ZoneInfo

import yfinance
from icecream import ic
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.common.constant import STOCK_CACHE_SECOND
from app.data.common.service import StockCodeFileReader
from app.data.yahoo.source.service import format_stock_code
from app.module.asset.enum import Country
from app.module.asset.model import StockMinutely
from app.module.asset.redis_repository import RedisRealTimeStockRepository
from app.module.asset.repository.stock_minutely_repository import StockMinutelyRepository
from app.module.asset.schema import StockInfo
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.constant import POOL_SIZE
from database.dependency import get_mysql_session, get_redis_pool

seoul_tz = ZoneInfo("Asia/Seoul")

executor = ThreadPoolExecutor(max_workers=POOL_SIZE)


def fetch_stock_price(stock_code: str) -> tuple[str, float]:
    try:
        stock = yfinance.Ticker(stock_code)
        current_price = stock.info.get("bid")
        return stock_code, current_price
    except Exception as e:
        ic(f"Error fetching stock data: {e}")
        return stock_code, 0.0


async def collect_stock_data(redis_client: Redis, session: AsyncSession, stock_code_list: list[StockInfo]) -> None:
    now = datetime.now(seoul_tz).replace(second=0, microsecond=0)

    code_price_pairs = []
    db_bulk_data = []

    ic(f"{len(stock_code_list)=}")

    event_loop = asyncio.get_event_loop()
    fetch_tasks = []

    for stockinfo in stock_code_list:
        try:
            stock_code = format_stock_code(
                stockinfo.code,
                Country[stockinfo.country.upper().replace(" ", "_")],
                stockinfo.market_index.upper(),
            )

            fetch_tasks.append(event_loop.run_in_executor(executor, fetch_stock_price, stock_code))

        except Exception as e:
            ic(f"{e=}")
            continue

    code_price_pairs = await asyncio.gather(*fetch_tasks)

    redis_bulk_data = [(code, price) for code, price in code_price_pairs if price is not None]

    for code, price in redis_bulk_data:
        current_stock_data = StockMinutely(code=code, datetime=now, current_price=price)
        db_bulk_data.append(current_stock_data)

    if redis_bulk_data:
        ic("Saving to Redis in bulk.")
        await asyncio.shield(
            RedisRealTimeStockRepository.bulk_save(redis_client, redis_bulk_data, expire_time=STOCK_CACHE_SECOND)
        )

    if db_bulk_data:
        ic("Saving to database in bulk.")
        await asyncio.shield(StockMinutelyRepository.bulk_upsert(session, db_bulk_data))


async def collect_all_stock_data(redis_client: Redis, session: AsyncSession) -> None:
    stock_code_list_bundle: list[list[StockInfo]] = StockCodeFileReader.world_get_stock_code_list_bundle()

    tasks = [collect_stock_data(redis_client, session, stock_code_list) for stock_code_list in stock_code_list_bundle]

    await asyncio.gather(*tasks, return_exceptions=True)


async def main():
    redis_client = get_redis_pool()
    async with get_mysql_session() as session:
        while True:
            try:
                await collect_all_stock_data(redis_client, session)
            except Exception as e:
                ic(f"Error in main loop: {e}")
                continue
            await asyncio.sleep(10)


if __name__ == "__main__":
    asyncio.run(main())
