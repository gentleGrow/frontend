import asyncio
import sys

from data.common.constant import STOCK_CHUNK_SIZE
from data.common.enums import MarketType
from data.korea_investment.sources.service import get_stock_code_list
from data.naver.sources.service import get_current_stock_price


async def main(market_type: MarketType):
    stock_code_list = get_stock_code_list(market_type)

    if market_type == MarketType.korea:
        for i in range(0, len(stock_code_list), STOCK_CHUNK_SIZE):
            stock_code_chunk = stock_code_list[i : i + STOCK_CHUNK_SIZE]
            await get_current_stock_price(stock_code_chunk)


if __name__ == "__main__":
    input_type = sys.argv[1] if len(sys.argv) > 1 else None

    while input_type not in {"korea", "oversea"}:
        input_type = input("[korea 혹은 oversea] 2개 중 1개를 입력해주세요: ")

    market_type = MarketType(input_type)  # type: ignore

    asyncio.run(main(market_type))
