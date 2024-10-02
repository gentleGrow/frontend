from datetime import date, datetime, timedelta
from enum import StrEnum

from dateutil.relativedelta import relativedelta

from app.common.util.time import get_now_date, get_now_datetime


class EstimateDividendType(StrEnum):
    EVERY = "every"
    TYPE = "type"


class CompositionType(StrEnum):
    COMPOSITION = "composition"
    ACCOUNT = "account"


class IntervalType(StrEnum):
    FIVEDAY = "5day"
    ONEMONTH = "1month"
    THREEMONTH = "3month"
    SIXMONTH = "6month"
    ONEYEAR = "1year"

    def get_start_end_time(self) -> tuple[date | datetime, date | datetime]:
        if self == IntervalType.FIVEDAY:
            end_datetime = get_now_datetime().replace(hour=0, minute=0, second=0, microsecond=0)
            return end_datetime - timedelta(days=4), end_datetime
        elif self == IntervalType.ONEMONTH:
            end_date = get_now_date()
            return end_date - timedelta(days=(7 * 4) + 1), end_date
        elif self == IntervalType.THREEMONTH:
            end_date = get_now_date()
            return end_date - relativedelta(months=2), end_date
        elif self == IntervalType.SIXMONTH:
            end_date = get_now_date()
            return end_date - relativedelta(months=5), end_date
        elif self == IntervalType.ONEYEAR:
            end_date = get_now_date()
            return end_date - relativedelta(months=11), end_date
        return

    def get_interval(self) -> int:
        if self == IntervalType.FIVEDAY:
            return 30
        elif self == IntervalType.ONEMONTH:
            return 60 * 24 * 30
        elif self == IntervalType.THREEMONTH:
            return 60 * 24 * 30
        elif self == IntervalType.SIXMONTH:
            return 60 * 24 * 30
        elif self == IntervalType.ONEYEAR:
            return 60 * 24 * 30
        return 1
