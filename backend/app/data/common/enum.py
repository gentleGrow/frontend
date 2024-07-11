from enum import StrEnum


class TradeType(StrEnum):
    STOCK_PRICE = "H0STCNT0"
    MOCK_STOCK_EXECUTION = "H0STCNI9"
    END_STOCK_TIME = "PINGPONG"
    K0STCNI0 = "K0STCNI0"  # 한국투자증권 api에 해당 trade type에 대한 정보를 찾지 못했습니다.
    K0STCNI9 = "K0STCNI9"  # 한국투자증권 api에 해당 trade type에 대한 정보를 찾지 못했습니다.


class SuccessCode(StrEnum):
    SUCCESS = "0"
    FAIL = "1"


class MarketType(StrEnum):
    KOREA = "korea"
    OVERSEAS = "overseas"
    REALTIME = "realtime"

    @classmethod
    def valid_inputs(cls):
        return {item.value for item in cls}


class CountryMarketCode(StrEnum):
    USA = ""
    KOREA_KOSPI = "KS"
    KOREA_KOSDAQ = "KQ"
    JAPAN = "T"
    UK = "L"
    GERMANY = "DE"
    FRANCE = "PA"
    CHINA = "SS"
    HONGKONG = "HK"
    CANADA = "TO"
    AUSTRALIA = "AX"
    INDIA = "BO"
    BRAZIL = "SA"
    ITALY = "MI"
    SPAIN = "MC"
    SWITZERLAND = "SW"
    NETHERLAND = "AS"
