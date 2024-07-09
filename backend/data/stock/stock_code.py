import asyncio
import logging
import os

from sqlalchemy.exc import IntegrityError

from app.module.asset.model import Stock  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.asset.repository.stock_repository import StockRepository
from app.module.asset.schema.stock_schema import StockInfo, StockList
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.common.service import get_all_stock_code_list
from database.dependency import get_mysql_session

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/stock_code.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


async def main():
    async with get_mysql_session() as session:
        stock_list: StockList = get_all_stock_code_list()
        for stock_info in stock_list.stocks:
            stock_info: StockInfo

            logging.info(f"[stock_code] {stock_info=}")

            try:
                await StockRepository.save(
                    session,
                    Stock(
                        code=stock_info.code,
                        name=stock_info.name,
                        market_index=stock_info.market_index,
                        country=stock_info.country,
                    ),
                )
            except IntegrityError as e:
                logging.error(f"[stock_code] IntegrityError: {e} - Skipping stock code {stock_info.code}")
                await session.rollback()
                continue
        logging.info("[stock_code] 주식 코드를 성공적으로 저장 하였습니다.")


if __name__ == "__main__":
    asyncio.run(main())
