import asyncio
import logging
import sys
from os import getenv

from dotenv import load_dotenv

from data.sources.auth import get_approval_key
from data.sources.constant import REDIS_STOCK_EXPIRE
from data.sources.stock_info import get_korea_current_price, get_korea_stock_code_list
from database.singleton import redis_repository

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_WEBSOCKET = getenv("KOREA_URL_WEBSOCKET", None)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


async def main():
    if KOREA_INVESTMENT_KEY is None or KOREA_INVESTMENT_SECRET is None:
        logging.error("환경변수를 확인해주세요")
        sys.exit(1)

    approval_key = get_approval_key(KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET)

    if approval_key is None:
        logging.error("허용 키가 없습니다.")
        sys.exit(1)

    stock_code_list = get_korea_stock_code_list()

    for stock_code, stock_name in stock_code_list:
        current_price = get_korea_current_price(approval_key, stock_code)
        logging.info(f"[분석] {stock_name} : {current_price}")
        await redis_repository.save(stock_code, current_price, REDIS_STOCK_EXPIRE)


if __name__ == "__main__":
    asyncio.run(main())
