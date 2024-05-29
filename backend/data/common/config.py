import logging
from os import getenv

from dotenv import find_dotenv, load_dotenv

from database.enums import EnvironmentType

load_dotenv(find_dotenv())

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)

ENVIRONMENT = getenv("ENVIRONMENT", None)

logging.info(f"[config] {ENVIRONMENT=}")

if ENVIRONMENT == EnvironmentType.LOCAL:
    KOREA_STOCK_FILEPATH = getenv("LOCAL_KOREA_STOCK_FILEPATH", None)
    ETC_STOCK_FILEPATH = getenv("LOCAL_ETC_STOCK_FILEPATH", None)
    NAS_STOCK_FILEPATH = getenv("LOCAL_NAS_STOCK_FILEPATH", None)
    NYS_STOCK_FILEPATH = getenv("LOCAL_NYS_STOCK_FILEPATH", None)
    JAPAN_STOCK_FILEPATH = getenv("LOCAL_JAPAN_STOCK_FILEPATH", None)
elif ENVIRONMENT == EnvironmentType.CLOUD:
    KOREA_STOCK_FILEPATH = getenv("KOREA_STOCK_FILEPATH", None)
    ETC_STOCK_FILEPATH = getenv("ETC_STOCK_FILEPATH", None)
    NAS_STOCK_FILEPATH = getenv("NAS_STOCK_FILEPATH", None)
    NYS_STOCK_FILEPATH = getenv("NYS_STOCK_FILEPATH", None)
    JAPAN_STOCK_FILEPATH = getenv("JAPAN_STOCK_FILEPATH", None)


S3_BUCKET_STOCK_FILES = getenv("S3_BUCKET_STOCK_FILES", None)
