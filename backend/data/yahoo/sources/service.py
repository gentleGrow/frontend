import calendar
import datetime
import time


def start_timestamp(year, month):
    date = datetime.datetime(year, month, 1, 0, 0)
    return int(time.mktime(date.timetuple()))


def end_timestamp(year, month):
    last_day = calendar.monthrange(year, month)[1]
    date = datetime.datetime(year, month, last_day, 23, 59)
    return int(time.mktime(date.timetuple()))


def get_period_bounds(stock_history_timerange):
    now = datetime.datetime.now()
    current_year = now.year
    current_month = now.month
    start_year = current_year - stock_history_timerange

    start_period = start_timestamp(start_year, current_month)
    end_period = end_timestamp(current_year, current_month)
    return start_period, end_period
