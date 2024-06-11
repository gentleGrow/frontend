import os

import boto3
import pandas as pd
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import find_dotenv, load_dotenv

from app.module.asset.schema.stock_schema import RealtimeStockInfo, RealtimeStockList, StockInfo, StockList
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
from database.enum import EnvironmentType

load_dotenv(find_dotenv())

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)


def download_file_from_s3(bucket, key, local_path) -> None:
    try:
        s3_client.download_file(bucket, key, local_path)
        logging.info(f"{local_path}경로에 ${key}를 저장하였습니다.")
    except FileNotFoundError as e:
        logging.error(f"Local path not found: {e}")
        raise
    except NoCredentialsError as e:
        logging.error(f"AWS credentials not found: {e}")
        raise
    except ClientError as e:
        logging.error(f"Client error: {e}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise


def read_realtime_stock_codes_from_excel(filepath: str) -> RealtimeStockList:
    try:
        df = pd.read_excel(filepath, usecols=[0, 1], header=None, names=["code", "name"])
    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        raise
    except ValueError as e:
        logging.error(f"Value error: {e}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise
    else:
        stock_infos = [RealtimeStockInfo(code=str(row["code"]), name=str(row["name"])) for _, row in df.iterrows()]
        return RealtimeStockList(stocks=stock_infos)


def read_stock_codes_from_excel(filepath: str) -> StockList:
    try:
        df = pd.read_excel(filepath, usecols=[0, 1, 2], header=None, names=["code", "name", "market_index"])
    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        raise
    except ValueError as e:
        logging.error(f"Value error: {e}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise
    else:
        stock_infos = [
            StockInfo(code=str(row["code"]), name=str(row["name"]), market_index=str(row["market_index"]))
            for _, row in df.iterrows()
        ]
        return StockList(stocks=stock_infos)


def get_realtime_stock_code_list() -> RealtimeStockList:
    korea_stock_code_list = read_realtime_stock_codes_from_excel(get_path(KOREA_STOCK_FILEPATH))
    etf_stock_code_list = read_realtime_stock_codes_from_excel(get_path(ETC_STOCK_FILEPATH))
    nas_stock_code_list = read_realtime_stock_codes_from_excel(get_path(NAS_STOCK_FILEPATH))
    nys_stock_code_list = read_realtime_stock_codes_from_excel(get_path(NYS_STOCK_FILEPATH))
    japan_stock_code_list = read_realtime_stock_codes_from_excel(get_path(JAPAN_STOCK_FILEPATH))
    return RealtimeStockList(
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


def get_usa_stock_code_list() -> StockList:
    nas_stock_code_list = read_stock_codes_from_excel(get_path(NAS_STOCK_FILEPATH))
    nys_stock_code_list = read_stock_codes_from_excel(get_path(NYS_STOCK_FILEPATH))
    return StockList(stocks=nas_stock_code_list.stocks + nys_stock_code_list.stocks)


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
    if ENVIRONMENT == EnvironmentType.DEV:
        return filepath
    else:
        return download_and_get_path(filepath)


def download_and_get_path(s3_key) -> str:
    local_path = f"/tmp/{os.path.basename(s3_key)}"
    download_file_from_s3(S3_BUCKET_STOCK_FILES, s3_key, local_path)
    return local_path
