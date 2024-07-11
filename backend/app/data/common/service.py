import os

import boto3
import pandas as pd
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import find_dotenv, load_dotenv

from app.data.common.config import (
    AUSTRALIA_STOCK_FILEPATH,
    BRAZIL_STOCK_FILEPATH,
    CANADA_STOCK_FILEPATH,
    CHINA_STOCK_FILEPATH,
    ENVIRONMENT,
    FRANCE_STOCK_FILEPATH,
    GERMANY_STOCK_FILEPATH,
    HONGKONG_STOCK_FILEPATH,
    INDIA_STOCK_FILEPATH,
    ITALY_STOCK_FILEPATH,
    JAPAN_STOCK_FILEPATH,
    KOREA_STOCK_FILEPATH,
    NETHERLAND_STOCK_FILEPATH,
    S3_BUCKET_STOCK_FILES,
    SPAIN_STOCK_FILEPATH,
    SWITZERLAND_STOCK_FILEPATH,
    UK_STOCK_FILEPATH,
    USA_STOCK_FILEPATH,
    logging,
)
from app.module.asset.schema.stock_schema import StockInfo, StockList
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


def read_stock_codes_from_excel(filepath: str) -> StockList:
    try:
        df = pd.read_excel(filepath, usecols=["Symbol", "Company Name", "Country", "Code"], header=0)
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
            StockInfo(
                code=str(row["Symbol"]),
                name=str(row["Company Name"]),
                country=str(row["Country"]),
                market_index=str(row["Code"]),
            )
            for _, row in df.iterrows()
        ]
        return StockList(stocks=stock_infos)


def get_korea_stock_code_list() -> StockList:
    korea_stock_code_list = read_stock_codes_from_excel(get_path(KOREA_STOCK_FILEPATH))
    return StockList(stocks=korea_stock_code_list.stocks)


def get_all_stock_code_list() -> StockList:
    korea_stock_code_list = read_stock_codes_from_excel(get_path(KOREA_STOCK_FILEPATH))
    usa_stock_code_list = read_stock_codes_from_excel(get_path(USA_STOCK_FILEPATH))
    japan_stock_code_list = read_stock_codes_from_excel(get_path(JAPAN_STOCK_FILEPATH))
    australia_stock_code_list = read_stock_codes_from_excel(get_path(AUSTRALIA_STOCK_FILEPATH))
    brazil_stock_code_list = read_stock_codes_from_excel(get_path(BRAZIL_STOCK_FILEPATH))
    canada_stock_code_list = read_stock_codes_from_excel(get_path(CANADA_STOCK_FILEPATH))
    china_stock_code_list = read_stock_codes_from_excel(get_path(CHINA_STOCK_FILEPATH))
    france_stock_code_list = read_stock_codes_from_excel(get_path(FRANCE_STOCK_FILEPATH))
    germany_stock_code_list = read_stock_codes_from_excel(get_path(GERMANY_STOCK_FILEPATH))
    hongkong_stock_code_list = read_stock_codes_from_excel(get_path(HONGKONG_STOCK_FILEPATH))
    india_stock_code_list = read_stock_codes_from_excel(get_path(INDIA_STOCK_FILEPATH))
    italy_stock_code_list = read_stock_codes_from_excel(get_path(ITALY_STOCK_FILEPATH))
    netherland_stock_code_list = read_stock_codes_from_excel(get_path(NETHERLAND_STOCK_FILEPATH))
    spain_stock_code_list = read_stock_codes_from_excel(get_path(SPAIN_STOCK_FILEPATH))
    switzerland_stock_code_list = read_stock_codes_from_excel(get_path(SWITZERLAND_STOCK_FILEPATH))
    uk_stock_code_list = read_stock_codes_from_excel(get_path(UK_STOCK_FILEPATH))

    return StockList(
        stocks=korea_stock_code_list.stocks
        + usa_stock_code_list.stocks
        + japan_stock_code_list.stocks
        + australia_stock_code_list.stocks
        + brazil_stock_code_list.stocks
        + canada_stock_code_list.stocks
        + china_stock_code_list.stocks
        + france_stock_code_list.stocks
        + germany_stock_code_list.stocks
        + hongkong_stock_code_list.stocks
        + india_stock_code_list.stocks
        + italy_stock_code_list.stocks
        + netherland_stock_code_list.stocks
        + spain_stock_code_list.stocks
        + switzerland_stock_code_list.stocks
        + uk_stock_code_list.stocks
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
