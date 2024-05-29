from typing import Callable

from data.common.enums import MarketType
from data.common.service import get_korea_stock_code_list, get_oversea_stock_code_list, get_realtime_stock_code_list

MAXIMUM_STOCK_CODES_CONNECTION = 40
PING_INTERVAL = 60
TIMEOUT_SECOND = 20
REDIS_STOCK_EXPIRE_SECONDS = 60 * 60 * 48
STOCK_CHUNK_SIZE = 10

MARKET_TYPE_N_STOCK_CODE_FUNC_MAP: dict[MarketType, Callable] = {
    MarketType.KOREA: get_korea_stock_code_list,
    MarketType.OVERSEAS: get_oversea_stock_code_list,
    MarketType.REALTIME: get_realtime_stock_code_list,
}
