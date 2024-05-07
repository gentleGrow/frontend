import asyncio
import sys

from data.common.constant import REDIS_STOCK_EXPIRE_SECONDS
from data.common.enums import MarketType
from data.korea_investment.sources.auth import KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET, get_approval_key
from data.korea_investment.sources.service import (
    get_korea_current_price,
    get_oversea_current_price,
    get_stock_code_list,
)
from database.singleton import redis_repository


async def main(market_type: MarketType):
    if KOREA_INVESTMENT_KEY is None or KOREA_INVESTMENT_SECRET is None:
        sys.exit(1)

    approval_key = get_approval_key(KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET)

    if approval_key is None:
        sys.exit(1)

    stock_code_list = get_stock_code_list(market_type)

    for stock_data in stock_code_list:
        if market_type == MarketType.korea:
            stock_code, stock_name, stock_index = stock_data
            current_price = get_korea_current_price(approval_key, stock_code)
        elif market_type == MarketType.overseas:
            stock_code, stock_name, excd = stock_data
            current_price = get_oversea_current_price(approval_key, stock_code, excd)
        else:
            raise ValueError("market_type is invalid")

        await redis_repository.save(stock_code, str(current_price), REDIS_STOCK_EXPIRE_SECONDS)


if __name__ == "__main__":
    input_type = sys.argv[1] if len(sys.argv) > 1 else None

    while input_type not in {"korea", "oversea"}:
        input_type = input("[korea 혹은 oversea] 2개 중 1개를 입력해주세요: ")

    asyncio.run(main(market_type=MarketType(input_type)))
