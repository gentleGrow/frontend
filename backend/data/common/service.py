import os

import boto3
import pandas as pd

from data.common.config import (
    ENVIRONMENT,
    ETC_STOCK_FILEPATH,
    JAPAN_STOCK_FILEPATH,
    KOREA_STOCK_FILEPATH,
    NAS_STOCK_FILEPATH,
    NYS_STOCK_FILEPATH,
    S3_BUCKET_STOCK_FILES,
    logging,
)
from data.common.schemas import RealtimeStockInfo, StockInfo, StockList, realtimeStockList
from database.enums import EnvironmentType

s3_client = boto3.client("s3")


def download_file_from_s3(bucket, key, local_path) -> None:
    try:
        s3_client.download_file(bucket, key, local_path)
        logging.info(f"{local_path}경로에 ${key}를 저장하였습니다.")
    except Exception:
        logging.error("파일을 다운로드하는데 실패하였습니다.")
        raise


def read_realtime_stock_codes_from_excel(filepath: str) -> realtimeStockList:
    try:
        df = pd.read_excel(filepath, usecols=[0, 1], header=None, names=["code", "name"])
    except Exception as e:
        logging.error(f"Error reading Excel file: {e}")
        raise
    else:
        stock_infos = [RealtimeStockInfo(code=str(row["code"]), name=str(row["name"])) for _, row in df.iterrows()]
        return realtimeStockList(stocks=stock_infos)


def read_stock_codes_from_excel(filepath: str) -> StockList:
    try:
        df = pd.read_excel(filepath, usecols=[0, 1, 2], header=None, names=["code", "name", "market_index"])
    except Exception as e:
        logging.error(f"Error reading Excel file: {e}")
        raise
    else:
        stock_infos = [
            StockInfo(code=str(row["code"]), name=str(row["name"]), market_index=str(row["market_index"]))
            for _, row in df.iterrows()
        ]
        return StockList(stocks=stock_infos)


def get_realtime_stock_code_list() -> realtimeStockList:
    korea_stock_code_list = read_realtime_stock_codes_from_excel(get_path(KOREA_STOCK_FILEPATH))
    etf_stock_code_list = read_realtime_stock_codes_from_excel(get_path(ETC_STOCK_FILEPATH))
    nas_stock_code_list = read_realtime_stock_codes_from_excel(get_path(NAS_STOCK_FILEPATH))
    nys_stock_code_list = read_realtime_stock_codes_from_excel(get_path(NYS_STOCK_FILEPATH))
    japan_stock_code_list = read_realtime_stock_codes_from_excel(get_path(JAPAN_STOCK_FILEPATH))
    return realtimeStockList(
        stocks=korea_stock_code_list.stocks
        + etf_stock_code_list.stocks
        + nas_stock_code_list.stocks
        + nys_stock_code_list.stocks
        + japan_stock_code_list.stocks
    )


def get_korea_stock_code_list() -> StockList:
    korea_stock_code_list = read_stock_codes_from_excel(get_path(KOREA_STOCK_FILEPATH))
    etf_stock_code_list = read_stock_codes_from_excel(get_path(ETC_STOCK_FILEPATH))
    return StockList(stocks=korea_stock_code_list.stocks + etf_stock_code_list.stocks)


def get_oversea_stock_code_list() -> StockList:
    nas_stock_code_list = read_stock_codes_from_excel(get_path(NAS_STOCK_FILEPATH))
    nys_stock_code_list = read_stock_codes_from_excel(get_path(NYS_STOCK_FILEPATH))
    japan_stock_code_list = read_stock_codes_from_excel(get_path(JAPAN_STOCK_FILEPATH))
    return StockList(stocks=nas_stock_code_list.stocks + nys_stock_code_list.stocks + japan_stock_code_list.stocks)


def get_all_stock_code_list() -> StockList:
    korea_stock_code_list = read_stock_codes_from_excel(get_path(KOREA_STOCK_FILEPATH))
    etf_stock_code_list = read_stock_codes_from_excel(get_path(ETC_STOCK_FILEPATH))
    nas_stock_code_list = read_stock_codes_from_excel(get_path(NAS_STOCK_FILEPATH))
    nys_stock_code_list = read_stock_codes_from_excel(get_path(NYS_STOCK_FILEPATH))
    japan_stock_code_list = read_stock_codes_from_excel(get_path(JAPAN_STOCK_FILEPATH))
    return StockList(
        stocks=korea_stock_code_list.stocks
        + etf_stock_code_list.stocks
        + nas_stock_code_list.stocks
        + nys_stock_code_list.stocks
        + japan_stock_code_list.stocks
    )


def get_path(filepath) -> str:
    if ENVIRONMENT == EnvironmentType.LOCAL:
        return filepath
    elif ENVIRONMENT == EnvironmentType.CLOUD:
        return download_and_get_path(filepath)
    else:
        return ""


def download_and_get_path(s3_key) -> str:
    local_path = f"/tmp/{os.path.basename(s3_key)}"
    download_file_from_s3(S3_BUCKET_STOCK_FILES, s3_key, local_path)
    return local_path
