import datetime

from app.common.util.time import end_timestamp, start_timestamp
from data.common.enum import CountryMarketCode


def get_period_bounds(stock_history_timerange: int) -> tuple[int, int]:
    now = datetime.datetime.now()
    current_year = now.year
    current_month = now.month
    start_year = current_year - stock_history_timerange

    return start_timestamp(start_year, current_month), end_timestamp(current_year, current_month)


def format_stock_code(code: str, country: str, market_index: str) -> str:
    country = country.upper()
    if country == "USA":
        return code
    elif country == "KOREA":
        if market_index.upper() == "KOSPI":
            return f"{code}.{CountryMarketCode.KOREA_KOSPI}"
        else:
            return f"{code}.{CountryMarketCode.KOREA_KOSDAQ}"
    else:
        return f"{code}.{getattr(CountryMarketCode, country)}"
