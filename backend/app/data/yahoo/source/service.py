import datetime

from app.common.util.time import end_timestamp, start_timestamp
from app.module.asset.enum import Country, CountryMarketCode, MarketIndex
from app.module.asset.model import (  # noqa: F401 > relationship 설정시 필요합니다.
    Asset,
    AssetStock,
    Dividend,
    ExchangeRate,
    Stock,
    StockDaily,
    StockMonthly,
    StockWeekly,
)
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.


def get_period_bounds(stock_history_timerange: int) -> tuple[int, int]:
    now = datetime.datetime.now()
    current_year = now.year
    current_month = now.month
    start_year = current_year - stock_history_timerange

    return start_timestamp(start_year, current_month), end_timestamp(current_year, current_month)


def format_stock_code(code: str, country: Country, market_index: MarketIndex) -> str:
    if country == Country.USA:
        return code
    elif country == Country.KOREA:
        if market_index == MarketIndex.KOSPI:
            return f"{code}.{CountryMarketCode.KOREA_KOSPI}"
        else:
            return f"{code}.{CountryMarketCode.KOREA_KOSDAQ}"
    else:
        return f"{code}.{market_index.value}"
