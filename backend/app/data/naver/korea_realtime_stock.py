import asyncio

from app.data.common.constant import STOCK_CHUNK_SIZE
from app.data.common.service import get_korea_stock_code_list
from app.data.naver.sources.service import get_stock_prices
from app.module.asset.schema.stock_schema import StockInfo


async def main():
    stock_code_list: list[StockInfo] = get_korea_stock_code_list()

    for i in range(0, len(stock_code_list), STOCK_CHUNK_SIZE):
        stock_info_list: list[StockInfo] = stock_code_list[i : i + STOCK_CHUNK_SIZE]
        await get_stock_prices(stock_info_list)
    # 네이버 실시간 주식 데이터 수집은 추후 수정하겠습니다.


if __name__ == "__main__":
    asyncio.run(main())
