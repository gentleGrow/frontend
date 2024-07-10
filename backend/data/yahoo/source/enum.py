from enum import StrEnum


class TimeInterval(StrEnum):
    DAY = "1d"
    WEEK = "1wk"
    MONTH = "1mo"


class Country(StrEnum):
    USA = "USA"
    JAPAN = "JAPAN"
    UK = "UK"
    GERMANY = "GERMANY"
    FRANCE = "FRANCE"
    CHINA = "CHINA"
    HONG_KONG = "HONG_KONG"
    CANADA = "CANADA"
    AUSTRALIA = "AUSTRALIA"
    INDIA = "INDIA"
    SOUTH_KOREA = "SOUTH_KOREA"
    BRAZIL = "BRAZIL"
    RUSSIA = "RUSSIA"
    ITALY = "ITALY"
    SPAIN = "SPAIN"
    SWITZERLAND = "SWITZERLAND"
    NETHERLANDS = "NETHERLANDS"
    EUROZONE = "EUROZONE"
    KOREA = "KOREA"


class MarketIndex(StrEnum):
    DJIA = "DJIA"
    IXIC = "IXIC"
    N225 = "N225"
    FTSE = "FTSE"
    DAX = "DAX"
    PX1 = "PX1"
    SHCOMP = "SHCOMP"
    HSI = "HSI"
    GSPTSE = "GSPTSE"
    AXJO = "AXJO"
    NSEI = "NSEI"
    KS11 = "KS11"
    BVSP = "BVSP"
    IMOEX = "IMOEX"
    FTSEMIB = "FTSEMIB"
    IBEX = "IBEX"
    SMI = "SMI"
    AEX = "AEX"
    SX5E = "SX5E"
    KOSPI = "KOSPI"
    KOSDAQ = "KOSDAQ"
