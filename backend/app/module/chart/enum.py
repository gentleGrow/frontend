from datetime import timedelta
from enum import StrEnum


class CompositionType(StrEnum):
    COMPOSITION = "composition"
    ACCOUNT = "account"


class IntervalType(StrEnum):
    ONEDAY = "1day"
    FIVEDAY = "5day"
    ONEMONTH = "1month"
    THREEMONTH = "3month"
    SIXMONTH = "6month"
    ONEYEAR = "1year"

    def get_timedelta(self) -> timedelta:
        if self == IntervalType.ONEDAY:
            return timedelta(hours=24)
        elif self == IntervalType.FIVEDAY:
            return timedelta(hours=5 * 24)
        elif self == IntervalType.ONEMONTH:
            return timedelta(days=30)
        elif self == IntervalType.THREEMONTH:
            return timedelta(days=90)
        elif self == IntervalType.SIXMONTH:
            return timedelta(days=180)
        elif self == IntervalType.ONEYEAR:
            return timedelta(days=360)
        return timedelta(days=30)
