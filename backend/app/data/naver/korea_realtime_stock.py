import asyncio

from app.data.common.constant import STOCK_CHUNK_SIZE
from app.data.common.service import get_korea_stock_code_list
from app.data.naver.sources.service import get_stock_prices
from app.module.asset.model import StockRealtime
from app.module.asset.repository.stock_realtime_repository import StockRealtimeRepository
from app.module.asset.schema.stock_schema import StockInfo, StockPrice
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.dependency import get_mysql_session


async def main():
    async with get_mysql_session() as session:
        stock_code_list: list[StockInfo] = get_korea_stock_code_list()

        for i in range(0, len(stock_code_list), STOCK_CHUNK_SIZE):
            stock_info_list: list[StockInfo] = stock_code_list[i : i + STOCK_CHUNK_SIZE]
            price_list: list[StockPrice] = await get_stock_prices(stock_info_list)

            realtime_stock_list = [
                StockRealtime(
                    code=stock_info.code,
                    name=stock_info.name,
                    price=stock_price.price,
                    country=stock_info.country,
                    market_index=stock_info.market_index,
                )
                for stock_info, stock_price in zip(stock_info_list, price_list)
            ]

            await StockRealtimeRepository.upsert(session, realtime_stock_list)


if __name__ == "__main__":
    asyncio.run(main())
