from enum import StrEnum


class StockType(StrEnum):
    H0STCNT0 = "H0STCNT0"
    H0STCNI9 = "H0STCNI9"
    PINGPONG = "PINGPONG"
    K0STCNI0 = "K0STCNI0"
    K0STCNI9 = "K0STCNI9"


class SocketCode(StrEnum):
    zero = "0"
    one = "1"
