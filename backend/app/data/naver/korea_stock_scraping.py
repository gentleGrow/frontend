import asyncio

from app.data.common.constant import STOCK_CHUNK_SIZE
from app.data.common.service import get_korea_stock_code_list
from app.data.naver.sources.service import get_stock_prices
from app.module.asset.schema.stock_schema import StockList, StockPrice


async def main():
    stock_code_list: StockList = get_korea_stock_code_list()

    stocks = stock_code_list.stocks
    for i in range(0, len(stocks), STOCK_CHUNK_SIZE):
        stock_code_chunk: StockList = StockList(stocks=stocks[i : i + STOCK_CHUNK_SIZE])
        price_list: list[StockPrice] = await get_stock_prices(stock_code_chunk)
        print(f"{price_list=}")


if __name__ == "__main__":
    asyncio.run(main())
