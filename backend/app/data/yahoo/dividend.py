import asyncio
import logging
import os

import yfinance
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.common.service import get_all_stock_code_list
from app.data.yahoo.source.service import format_stock_code
from app.module.asset.model import Stock  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.asset.model import Dividend
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.schema.stock_schema import StockList
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.dependency import get_mysql_session

logging.basicConfig(
    filename="backend/logs/dividend_oversea.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

os.makedirs("./logs", exist_ok=True)


async def insert_dividend_data(session: AsyncSession, stock_list: StockList):
    for stock in stock_list.stocks:
        try:
            stock_code = format_stock_code(stock.code, stock.country, stock.market_index)
            stock_info = yfinance.Ticker(stock_code)
        except Exception:
            continue

        dividends = stock_info.dividends

        if dividends.empty:
            newest_dividend = 0
        else:
            newest_dividend = dividends[-1]

        dividend = Dividend(dividend=newest_dividend, stock_code=stock.code)

        try:
            await DividendRepository.save(session=session, dividend=dividend)
        except Exception:
            continue


async def main():
    logging.info("dividend 수집을 시작합니다.")
    stock_list: StockList = get_all_stock_code_list()

    async with get_mysql_session() as session:
        await insert_dividend_data(session, stock_list)

    logging.info("dividend 수집을 마칩니다.")


if __name__ == "__main__":
    asyncio.run(main())
