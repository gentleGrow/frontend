import logging
from os import getenv

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)

KOREA_STOCK_FILEPATH = "https://gaemischool-stock-codes.s3.ap-northeast-2.amazonaws.com/korea_stock_list.xlsx"
ETC_STOCK_FILEPATH = "https://gaemischool-stock-codes.s3.ap-northeast-2.amazonaws.com/etf_stock_list.xlsx"
NAS_STOCK_FILEPATH = "https://gaemischool-stock-codes.s3.ap-northeast-2.amazonaws.com/nas_stock_list.xlsx"
NYS_STOCK_FILEPATH = "https://gaemischool-stock-codes.s3.ap-northeast-2.amazonaws.com/nys_stock_list.xlsx"
JAPAN_STOCK_FILEPATH = "https://gaemischool-stock-codes.s3.ap-northeast-2.amazonaws.com/japan_stock_list.xlsx"
