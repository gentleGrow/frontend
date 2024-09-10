import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo

import yfinance
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.common.constant import STOCK_CACHE_SECOND
from app.data.common.service import get_usa_stock_code_list
from app.data.yahoo.source.service import format_stock_code
from app.module.asset.enum import Country
from app.module.asset.model import StockMinutely
from app.module.asset.redis_repository import RedisRealTimeStockRepository
from app.module.asset.repository.stock_minutely_repository import StockMinutelyRepository
from app.module.asset.schema import StockInfo
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.dependency import get_mysql_session, get_redis_pool

seoul_tz = ZoneInfo("Asia/Seoul")


async def collect_stock_data(redis_client: Redis, session: AsyncSession, stock_code_list: list[StockInfo]) -> None:
    now = datetime.now(seoul_tz).replace(second=0, microsecond=0)

    code_price_pairs = []
    for stockinfo in stock_code_list:
        try:
            stock_code = format_stock_code(
                stockinfo.code,
                Country[stockinfo.country.upper().replace(" ", "_")],
                stockinfo.market_index.upper(),
            )

            stock = yfinance.Ticker(stock_code)
            current_price = stock.info.get("bid")

            if current_price:
                code_price_pairs.append((stock_code, current_price))
        except Exception:
            continue

    db_bulk_data = []

    for code, price in code_price_pairs:
        current_stock_data = StockMinutely(code=code, datetime=now, current_price=price)
        db_bulk_data.append(current_stock_data)
        await RedisRealTimeStockRepository.save(redis_client, code, price, expire_time=STOCK_CACHE_SECOND)

    if db_bulk_data:
        await StockMinutelyRepository.bulk_upsert(session, db_bulk_data)


async def main():
    redis_client = get_redis_pool()
    async with get_mysql_session() as session:
        while True:
            try:
                stock_code_list: list[StockInfo] = get_usa_stock_code_list()
                await collect_stock_data(redis_client, session, stock_code_list)
            except Exception:
                continue
            await asyncio.sleep(10)


if __name__ == "__main__":
    asyncio.run(main())
