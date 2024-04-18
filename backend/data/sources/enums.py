from enum import StrEnum


class TradeType(StrEnum):
    H0STCNT0 = "H0STCNT0"
    H0STCNI9 = "H0STCNI9"
    PINGPONG = "PINGPONG"
    K0STCNI0 = "K0STCNI0"
    K0STCNI9 = "K0STCNI9"


class SuccessCode(StrEnum):
    success = "0"
    fail = "1"
