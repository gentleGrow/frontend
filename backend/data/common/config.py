import logging
from os import getenv

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)

KOREA_STOCK_FILEPATH = "./etc/files/korea_stock_list.xlsx"
ETC_STOCK_FILEPATH = "./etc/files/etf_stock_list.xlsx"
NAS_STOCK_FILEPATH = "./etc/files/nas_realtime_stock_list.xlsx"
NYS_STOCK_FILEPATH = "./etc/files/nys_realtime_stock_list.xlsx"
JAPAN_STOCK_FILEPATH = "./etc/files/japan_realtime_stock_list.xlsx"
