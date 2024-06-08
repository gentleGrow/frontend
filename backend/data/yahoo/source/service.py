import datetime

from app.common.util.time import end_timestamp, start_timestamp


def get_period_bounds(stock_history_timerange: int) -> tuple[int, int]:
    now = datetime.datetime.now()
    current_year = now.year
    current_month = now.month
    start_year = current_year - stock_history_timerange

    return start_timestamp(start_year, current_month), end_timestamp(current_year, current_month)
