import asyncio

import pandas as pd

from app.modules.asset_management.models import (  # noqa: F401 > relationship 설정시 필요합니다.
    StockDaily,
    StockMonthly,
    StockWeekly,
)
from app.modules.auth.models import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.common.schemas import StockInfo, StockList
from data.common.service import get_oversea_stock_code_list
from data.yahoo.sources.constants import STOCK_HISTORY_TIMERANGE_YEAR, TIME_INTERVAL_MODEL_REPO_MAP
from data.yahoo.sources.enums import TimeInterval
from data.yahoo.sources.schemas import StockDataFrame
from data.yahoo.sources.service import get_period_bounds
from database.dependencies import get_mysql_session


async def main():
    start_period, end_period = get_period_bounds(STOCK_HISTORY_TIMERANGE_YEAR)
    stock_list: StockList = get_oversea_stock_code_list()

    async for session in get_mysql_session():
        for stock_info in stock_list.stocks:
            stock_info: StockInfo
            for interval in TimeInterval:
                stock_model, stock_repository = TIME_INTERVAL_MODEL_REPO_MAP[interval]
                stock_repository_instance = stock_repository(session)

                url = (
                    f"https://query1.finance.yahoo.com/v7/finance/download/{stock_info.code}"
                    f"?period1={start_period}&period2={end_period}&interval={interval.value}"
                    f"&events=history&includeAdjustedClose=true"
                )
                df = pd.read_csv(url)

                for _, row in df.iterrows():
                    stock_dataframe = StockDataFrame(
                        date=row["Date"],
                        open=row["Open"],
                        high=row["High"],
                        low=row["Low"],
                        close=row["Close"],
                        adj_close=row["Adj Close"],
                        volume=row["Volume"],
                    )

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

                    await stock_repository_instance.save(stock_row)


if __name__ == "__main__":
    asyncio.run(main())
