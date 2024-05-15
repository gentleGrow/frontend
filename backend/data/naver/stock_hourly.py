import asyncio
import sys

from app.common.utils.logging import logging
from app.modules.asset_management.constants import REDIS_STOCK_EXPIRE_SECOND
from data.common.constant import MARKET_TYPE_N_STOCK_CODE_FUNC_MAP, STOCK_CHUNK_SIZE
from data.common.enums import MarketType
from data.common.schemas import StockList, StockPriceList
from data.naver.sources.service import get_stock_prices
from database.singleton import redis_stock_repository


async def main(market_type: MarketType):
    stock_code_list: StockList = MARKET_TYPE_N_STOCK_CODE_FUNC_MAP[market_type]()

    if market_type == MarketType.KOREA:
        stocks = stock_code_list.stocks
        for i in range(0, len(stocks), STOCK_CHUNK_SIZE):
            stock_code_chunk: StockList = StockList(stocks=stocks[i : i + STOCK_CHUNK_SIZE])
            price_list: StockPriceList = await get_stock_prices(stock_code_chunk)

            logging.info(f"{stock_code_chunk=} {price_list=}")
            await redis_stock_repository.save(stock_code_chunk, price_list, REDIS_STOCK_EXPIRE_SECOND)


if __name__ == "__main__":
    input_type = sys.argv[1] if len(sys.argv) > 1 else None

    while input_type not in MarketType.valid_inputs():
        input_type = input("[korea 혹은 oversea] 2개 중 1개를 입력해주세요: ")

    asyncio.run(main(market_type=MarketType(input_type)))  # type: ignore
