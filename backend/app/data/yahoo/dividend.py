import asyncio

import yfinance
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.common.service import get_all_stock_code_list
from app.data.yahoo.source.service import format_stock_code
from app.module.asset.model import Stock  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.asset.model import Dividend
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.schema.stock_schema import StockInfo
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.dependency import get_mysql_session


async def insert_dividend_data(session: AsyncSession, stock_list: list[StockInfo]):
    for stock in stock_list:
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
    stock_list: list[StockInfo] = get_all_stock_code_list()

    async with get_mysql_session() as session:
        await insert_dividend_data(session, stock_list)


if __name__ == "__main__":
    asyncio.run(main())
