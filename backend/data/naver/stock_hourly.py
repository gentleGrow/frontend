import asyncio
import sys

from app.modules.asset_management.constants import REDIS_STOCK_EXPIRE_SECOND
from data.common.constant import STOCK_CHUNK_SIZE
from data.common.enums import MarketType
from data.common.schemas import StockInfo, StockList, StockPriceList
from data.common.service import get_stock_code_list
from data.naver.sources.repository import StockRepository
from data.naver.sources.service import get_stock_prices
from database.config import AsyncDBSession
from database.singleton import redis_stock_repository

stock_repository = StockRepository()


async def main(market_type: MarketType):
    stock_code_list = get_stock_code_list(market_type)

    if market_type == MarketType.KOREA:
        for i in range(0, len(stock_code_list), STOCK_CHUNK_SIZE):
            stock_chunk_dicts = [
                StockInfo(code=code, name=name, market_index=index)
                for code, name, index in stock_code_list[i : i + STOCK_CHUNK_SIZE]
            ]
            stock_code_chunk: StockList = StockList(stocks=stock_chunk_dicts)
            price_list: StockPriceList = await get_stock_prices(stock_code_chunk)

            await asyncio.gather(
                stock_repository.save(AsyncDBSession, stock_code_chunk, price_list),
                redis_stock_repository.save(stock_code_chunk, price_list, REDIS_STOCK_EXPIRE_SECOND),
            )


if __name__ == "__main__":
    input_type = sys.argv[1] if len(sys.argv) > 1 else None

    while input_type not in {"korea", "overseas"}:
        input_type = input("[korea 혹은 overseas] 2개 중 1개를 입력해주세요: ")

    asyncio.run(main(market_type=MarketType(input_type)))  # type: ignore
