import logging
from os import getenv

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)

KOREA_STOCK_FILEPATH = getenv("KOREA_STOCK_FILEPATH", None)
ETC_STOCK_FILEPATH = getenv("ETC_STOCK_FILEPATH", None)
NAS_STOCK_FILEPATH = getenv("NAS_STOCK_FILEPATH", None)
NYS_STOCK_FILEPATH = getenv("NYS_STOCK_FILEPATH", None)
JAPAN_STOCK_FILEPATH = getenv("JAPAN_STOCK_FILEPATH", None)

S3_BUCKET_STOCK_FILES = getenv("S3_BUCKET_STOCK_FILES", None)
