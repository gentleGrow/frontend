import asyncio
import logging
import os

from sqlalchemy.exc import IntegrityError

from app.module.asset.model import Stock  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.asset.schema.stock_schema import StockInfo, StockList
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.common.repository import StockRepository
from data.common.service import get_all_stock_code_list
from database.dependency import get_mysql_session

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/stock_code.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


async def main():
    async for session in get_mysql_session():
        stock_list: StockList = get_all_stock_code_list()
        for stock_info in stock_list.stocks:
            stock_info: StockInfo

            logging.info(f"[stock_code] {stock_info=}")

            try:
                await StockRepository.save(
                    session, Stock(code=stock_info.code, name=stock_info.name, market_index=stock_info.market_index)
                )
            except IntegrityError as e:
                logging.error(f"[stock_code] IntegrityError: {e} - Skipping stock code {stock_info.code}")
                await session.rollback()
                continue


if __name__ == "__main__":
    asyncio.run(main())
