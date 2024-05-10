import pandas

from data.common.config import (
    ETC_STOCK_FILEPATH,
    JAPAN_STOCK_FILEPATH,
    KOREA_STOCK_FILEPATH,
    NAS_STOCK_FILEPATH,
    NYS_STOCK_FILEPATH,
)
from data.common.constant import MARKET_TYPE_N_STOCK_CODE_FUNC_MAP
from data.common.enums import MarketType
from data.common.schemas import StockInfo, StockList


def read_realtime_stock_codes_from_excel(filepath: str) -> list[tuple[str, str]]:
    df = pandas.read_excel(filepath, usecols=[0, 1], header=None)
    return list(zip(df[0], df[1]))


def read_stock_codes_from_excel(filepath: str) -> StockList:
    df = pandas.read_excel(filepath, usecols=[0, 1, 2], header=None)
    return StockList(
        [StockInfo(code=str(row[0]), name=str(row[1]), market_index=str(row[2])) for _, row in df.iterrows()]
    )


def get_stock_code_list(market: MarketType):
    return MARKET_TYPE_N_STOCK_CODE_FUNC_MAP[market]()


def get_realtime_stock_code_list() -> list:
    korea_stock_code_list = read_realtime_stock_codes_from_excel(KOREA_STOCK_FILEPATH)
    etf_stock_code_list = read_realtime_stock_codes_from_excel(ETC_STOCK_FILEPATH)
    nas_stock_code_list = read_realtime_stock_codes_from_excel(NAS_STOCK_FILEPATH)
    nys_stock_code_list = read_realtime_stock_codes_from_excel(NYS_STOCK_FILEPATH)
    japan_stock_code_list = read_realtime_stock_codes_from_excel(JAPAN_STOCK_FILEPATH)
    return (
        korea_stock_code_list + etf_stock_code_list + nas_stock_code_list + nys_stock_code_list + japan_stock_code_list
    )


def get_korea_stock_code_list() -> StockList:
    korea_stock_code_list = read_stock_codes_from_excel(KOREA_STOCK_FILEPATH)
    etf_stock_code_list = read_stock_codes_from_excel(ETC_STOCK_FILEPATH)
    return korea_stock_code_list + etf_stock_code_list


def get_oversea_stock_code_list() -> StockList:
    nas_stock_code_list = read_stock_codes_from_excel(NAS_STOCK_FILEPATH)
    nys_stock_code_list = read_stock_codes_from_excel(NYS_STOCK_FILEPATH)
    japan_stock_code_list = read_stock_codes_from_excel(JAPAN_STOCK_FILEPATH)
    return StockList(stocks=nas_stock_code_list.stocks + nys_stock_code_list.stocks + japan_stock_code_list.stocks)
