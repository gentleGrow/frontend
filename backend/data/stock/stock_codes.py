import asyncio

from sqlalchemy.exc import IntegrityError

from app.common.utils.logging import logging
from app.modules.asset_management.models import Stock  # noqa: F401 > relationship 설정시 필요합니다.
from app.modules.auth.models import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.common.repository import StockRepository
from data.common.schemas import StockInfo, StockList
from data.common.service import get_all_stock_code_list
from database.dependencies import transactional_session


async def main():
    async with transactional_session() as session:
        stock_repository = StockRepository(session)

        stock_list: StockList = get_all_stock_code_list()
        for stock_info in stock_list.stocks:
            stock_info: StockInfo

            logging.info(f"[stock_codes] {stock_info=}")

            try:
                await stock_repository.save(
                    Stock(code=stock_info.code, name=stock_info.name, market_index=stock_info.market_index)
                )
            except IntegrityError as e:
                logging.error(f"[stock_codes] IntegrityError: {e} - Skipping stock code {stock_info.code}")
                await session.rollback()
                continue


if __name__ == "__main__":
    asyncio.run(main())
