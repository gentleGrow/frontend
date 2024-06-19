import asyncio
import logging
import os
from datetime import date

import yfinance
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import Stock  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.schema.stock_schema import StockList
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.common.service import get_all_stock_code_list
from database.dependency import get_mysql_session

logging.basicConfig(
    filename="backend/logs/dividend_oversea.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

os.makedirs("./logs", exist_ok=True)


async def insert_dividend_data(session: AsyncSession, stock_list: StockList):
    for stock in stock_list.stocks:
        stock_info = yfinance.Ticker(stock.code)
        dividends = stock_info.dividends

        logging.info(f"{stock.code=}{dividends.empty=}")

        if dividends.empty:
            await DividendRepository.save_dividend(
                session=session,
                dividend=0,
                payment_date=date.today(),
                dividend_yield=0.0,
                stock_code=stock.code,
            )
        else:
            most_recent_dividend = dividends[-1]

            await DividendRepository.save_dividend(
                session=session,
                dividend=most_recent_dividend,
                payment_date=date.today(),
                dividend_yield=0.0,
                stock_code=stock.code,
            )


async def main():
    logging.info("dividend_usa를 시작합니다.")
    stock_list: StockList = get_all_stock_code_list()

    async for session in get_mysql_session():
        await insert_dividend_data(session, stock_list)

    logging.info("dividend_usa를 마칩니다.")


if __name__ == "__main__":
    asyncio.run(main())
