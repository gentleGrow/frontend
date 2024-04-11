import sys
import threading
import time
from os import getenv

import websocket
from dotenv import load_dotenv

from data.sources.auth import get_approval_key
from data.sources.constant import MAXIMUM_WEBSOCKET_CONNECTION, PING_INTERVAL, TIMEOUT_SECOND
from data.sources.stock_info import (
    parse_error_stock_data,
    parse_stock_name_price,
    read_stock_codes_from_excel,
    subscribe_to_stock_batch,
)

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_WEBSOCKET = getenv("KOREA_URL_WEBSOCKET", None)


def divide_chunks(stock_code_list: list, MAXIMUM_WEBSOCKET_CONNECTION: int):
    for idx in range(0, len(stock_code_list), MAXIMUM_WEBSOCKET_CONNECTION):
        yield stock_code_list[idx : idx + MAXIMUM_WEBSOCKET_CONNECTION]


def set_timeout(timeout_seconds: int, flag: list):
    time.sleep(timeout_seconds)
    flag[0] = True


def main():
    if KOREA_INVESTMENT_KEY is None or KOREA_INVESTMENT_SECRET is None:
        print("환경변수를 확인해주세요")
        sys.exit(1)

    approval_key = get_approval_key(KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET)

    if approval_key is None:
        print("웹 소켓 연결 키가 없습니다.")
        sys.exit(1)

    filepath = "/Users/kcw2297/Desktop/stock_list.xlsx"
    stock_code_list = read_stock_codes_from_excel(filepath)

    stock_code_chunks = list(divide_chunks(stock_code_list, MAXIMUM_WEBSOCKET_CONNECTION))

    PATH = "tryitout/H0STCNT0"
    URL = f"{KOREA_URL_WEBSOCKET}/{PATH}"
    ws = websocket.WebSocket()

    try:
        ws.connect(URL, ping_interval=PING_INTERVAL)
        while True:
            for chunk in stock_code_chunks:
                timeout_flag = [False]
                timer_thread = threading.Thread(target=set_timeout, args=(TIMEOUT_SECOND, timeout_flag))
                timer_thread.start()

                subscribe_to_stock_batch(approval_key, chunk, ws)

                try:
                    while not timeout_flag[0]:
                        data = ws.recv()
                        time.sleep(0.1)

                        if data[0] == "0":
                            data_array = data.split("|")
                            stock_type = data_array[1]

                            if stock_type == "H0STCNT0":
                                stock_raw_info = data_array[3]
                                current_stock_info = parse_stock_name_price(stock_raw_info)
                                print(f"current_stock_info : {current_stock_info}")

                        else:
                            parse_error_stock_data(data)

                except websocket.WebSocketConnectionClosedException:
                    break
                finally:
                    timer_thread.join()

                ws.close()
                ws.connect(URL, ping_interval=PING_INTERVAL)
    finally:
        ws.close()


if __name__ == "__main__":
    main()
