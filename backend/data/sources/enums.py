from enum import StrEnum


class TradeType(StrEnum):
    stock_price = "H0STCNT0"
    mock_stock_execution = "H0STCNI9"
    end_stock_time = "PINGPONG"
    K0STCNI0 = "K0STCNI0"  # 한국투자증권 api에 해당 trade type에 대한 정보를 찾지 못했습니다.
    K0STCNI9 = "K0STCNI9"  # 한국투자증권 api에 해당 trade type에 대한 정보를 찾지 못했습니다.


class SuccessCode(StrEnum):
    success = "0"
    fail = "1"


class MarketType(StrEnum):
    korea = "korea"
    overseas = "overseas"
    realtime = "realtime"
