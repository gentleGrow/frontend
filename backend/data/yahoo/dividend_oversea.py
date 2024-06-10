import asyncio
import logging
import os

import yfinance as yf
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.repository.stock_repository import StockRepository
from app.module.asset.schema.stock_schema import StockList
from data.common.service import get_oversea_stock_code_list
from database.dependency import get_mysql_session

log_dir = "./logs"
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    filename="./logs/dividend_oversea.log",
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


async def insert_dividend_data(session: AsyncSession, stock_list: StockList):
    for stock in stock_list.stocks:
        stock_info = yf.Ticker(stock.code)
        dividends = stock_info.dividends

        if not dividends.empty:
            most_recent_date = dividends.index[-1]
            most_recent_dividend = dividends[-1]

            stock_obj = await StockRepository.get_by_code(session, stock.code)

            if stock_obj:
                await DividendRepository.save_dividend(
                    session=session,
                    dividend_amount=most_recent_dividend,
                    payment_date=most_recent_date.date(),
                    dividend_yield=0.0,
                    stock_code=stock_obj.code,
                )


async def main():
    logging.info("dividend_overseas를 시작합니다.")
    stock_list: StockList = get_oversea_stock_code_list()

    async for session in get_mysql_session():
        await insert_dividend_data(session, stock_list)

    logging.info("dividend_overseas를 마칩니다.")


if __name__ == "__main__":
    asyncio.run(main())
