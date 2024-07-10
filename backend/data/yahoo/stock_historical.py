import asyncio
import logging
import os

import pandas as pd
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import Stock, StockDaily, StockMonthly, StockWeekly  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.asset.repository.stock_repository import StockRepository
from app.module.asset.schema.stock_schema import StockList
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.common.service import get_all_stock_code_list
from data.yahoo.source.constant import STOCK_HISTORY_TIMERANGE_YEAR, TIME_INTERVAL_MODEL_REPO_MAP
from data.yahoo.source.enum import Country, MarketIndex, TimeInterval
from data.yahoo.source.schema import StockDataFrame
from data.yahoo.source.service import format_stock_code, get_period_bounds
from database.dependency import get_mysql_session

log_dir = "./logs"
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    filename="./logs/stock_historical.log",
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


async def process_stock_data(session: AsyncSession, stock_list: StockList, start_period: int, end_period: int):
    logging.info("파싱을 시작합니다.")
    for stock_info in stock_list.stocks:
        for interval in TimeInterval:
            stock_model = TIME_INTERVAL_MODEL_REPO_MAP[interval]

            stock_code = format_stock_code(
                stock_info.code,
                Country[stock_info.country.upper().replace(" ", "_")],
                MarketIndex[stock_info.market_index.upper()],
            )

            url = (
                f"https://query1.finance.yahoo.com/v7/finance/download/{stock_code}"
                f"?period1={start_period}&period2={end_period}&interval={interval.value}"
                f"&events=history&includeAdjustedClose=true"
            )

            try:
                df = pd.read_csv(url)
            except Exception:
                continue

            for _, row in df.iterrows():
                try:
                    stock_dataframe = StockDataFrame(
                        date=row["Date"],
                        open=row["Open"],
                        high=row["High"],
                        low=row["Low"],
                        close=row["Close"],
                        adj_close=row["Adj Close"],
                        volume=row["Volume"],
                    )
                except Exception:
                    continue

                stock_row = stock_model(
                    code=stock_info.code,
                    date=stock_dataframe.date,
                    opening_price=stock_dataframe.open,
                    highest_price=stock_dataframe.high,
                    lowest_price=stock_dataframe.low,
                    close_price=stock_dataframe.close,
                    adj_close_price=stock_dataframe.adj_close,
                    trade_volume=stock_dataframe.volume,
                )

                try:
                    await StockRepository.save(session, stock_row)  # type: ignore[model 객체 type 인식 안됨]
                except IntegrityError as e:
                    logging.error(f"[process_stock_data] IntegrityError: {e} - Skipping stock code {stock_info.code}")
                    await session.rollback()
                    continue

    logging.info("주식 데이터 수집을 완료 합니다.")


async def main():
    logging.info("stock_overseas를 시작합니다.")
    start_period, end_period = get_period_bounds(STOCK_HISTORY_TIMERANGE_YEAR)
    stock_list: StockList = get_all_stock_code_list()

    async with get_mysql_session() as session:
        await process_stock_data(session, stock_list, start_period, end_period)
    logging.info("stock_overseas를 마칩니다.")


if __name__ == "__main__":
    asyncio.run(main())
