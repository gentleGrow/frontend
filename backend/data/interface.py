import asyncio
import sys
from os import getenv

from dotenv import load_dotenv

from data.sources.auth import get_approval_key
from data.sources.stock_info import batch_subscribe_to_stocks, read_stock_codes_from_excel

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)

filepath = "/Users/kcw2297/Desktop/stock_list.xlsx"
stock_code_list = read_stock_codes_from_excel(filepath)

if KOREA_INVESTMENT_KEY is None or KOREA_INVESTMENT_SECRET is None:
    print("환경변수를 확인해주세요")
    sys.exit(1)

approval_key = get_approval_key(KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET)

if approval_key is None:
    print("웹 소켓 연결 키가 없습니다.")
    sys.exit(1)

# [정보] 최대 batch 크기는 20개 이며 그 이상은 별도 소켓 연결을 해야합니다.
max_batch_size = 20
asyncio.run(batch_subscribe_to_stocks(approval_key, stock_code_list, max_batch_size))
