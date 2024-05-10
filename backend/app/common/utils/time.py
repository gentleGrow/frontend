import calendar
import datetime
import time


def start_timestamp(year: int, month: int) -> int:
    date = datetime.datetime(year, month, 1, 0, 0)
    return int(time.mktime(date.timetuple()))


def end_timestamp(year: int, month: int) -> int:
    last_day = calendar.monthrange(year, month)[1]
    date = datetime.datetime(year, month, last_day, 23, 59)
    return int(time.mktime(date.timetuple()))
