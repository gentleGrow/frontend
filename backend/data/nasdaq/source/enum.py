from enum import StrEnum


class CountryCurrency(StrEnum):
    JAPAN = "JPY"
    KOREA = "KRW"
    USA = "USD"


class CountryCode(StrEnum):
    JAPAN = "JP"
    KOREA = "KR"
    USA = "US"


class DataSource(StrEnum):
    Federal_Reserve_Economic_Data = "FRED"
    DR = "DR"
    DailyExchange = "DE"
