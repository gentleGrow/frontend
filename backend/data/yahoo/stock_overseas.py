import asyncio

import pandas as pd

from app.modules.asset_management.models import Stock
from data.common.schemas import StockList
from data.common.service import get_oversea_stock_code_list
from data.yahoo.sources.constants import STOCK_HISTORY_TIMERANGE, STOCK_TIME_INTERVAL
from data.yahoo.sources.repository import StockRepository
from data.yahoo.sources.schemas import StockDataFrame
from data.yahoo.sources.service import get_period_bounds
from database.dependencies import get_mysql_async_session


async def main():
    start_period, end_period = get_period_bounds(STOCK_HISTORY_TIMERANGE)
    stock_list: StockList = get_oversea_stock_code_list()

    async with get_mysql_async_session() as session:
        stock_repository = StockRepository(session)

        for stock_info in stock_list.stocks:
            url = (
                f"https://query1.finance.yahoo.com/v7/finance/download/{stock_info.code}"
                f"?period1={start_period}&period2={end_period}&interval={STOCK_TIME_INTERVAL}"
                f"&events=history&includeAdjustedClose=true"
            )
            df = pd.read_csv(url)

            for _, row in df.iterrows():
                stock_row = StockDataFrame(
                    date=row["Date"],
                    open=row["Open"],
                    high=row["High"],
                    low=row["Low"],
                    close=row["Close"],
                    adj_close=row["Adj Close"],
                    volume=row["Volume"],
                )
                stock = Stock(
                    code=stock_info.code,
                    name=stock_info.name,
                    market_index=stock_info.market_index,
                    date=stock_row.date,
                    open=stock_row.open,
                    high=stock_row.high,
                    low=stock_row.low,
                    close=stock_row.close,
                    adj_close=stock_row.adj_close,
                    volume=stock_row.volume,
                )
                await stock_repository.save(stock)


if __name__ == "__main__":
    asyncio.run(main())
