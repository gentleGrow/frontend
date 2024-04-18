import asyncio
import json
import logging
import sys
import threading
from os import getenv

import websocket
from dotenv import load_dotenv

from data.sources.auth import get_approval_key
from data.sources.constant import MAXIMUM_WEBSOCKET_CONNECTION, PING_INTERVAL, REDIS_STOCK_EXPIRE, TIMEOUT_SECOND
from data.sources.enums import TradeType
from data.sources.stock_info import (
    divide_stock_list,
    get_realtime_stock_code_list,
    parse_stock_data,
    set_timeout,
    socket_subscribe_message,
    subscribe_to_stock_batch,
)
from database.singleton import redis_repository

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_WEBSOCKET = getenv("KOREA_URL_WEBSOCKET", None)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


async def main():
    if KOREA_INVESTMENT_KEY is None or KOREA_INVESTMENT_SECRET is None:
        logging.error("환경변수를 확인해주세요")
        sys.exit(1)

    approval_key = get_approval_key(KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET)

    if approval_key is None:
        logging.error("웹 소켓 연결 키가 없습니다.")
        sys.exit(1)

    stock_code_list = get_realtime_stock_code_list()
    stock_code_chunks = list(divide_stock_list(stock_code_list, MAXIMUM_WEBSOCKET_CONNECTION))

    URL = f"{KOREA_URL_WEBSOCKET}/tryitout/H0STCNT0"
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
                        raw_stock_data = ws.recv()

                        logging.info(f"[분석] raw_stock_data : {raw_stock_data}")

                        if raw_stock_data[0] != "0":
                            stock_data = json.loads(raw_stock_data)
                            socket_subscribe_message(stock_data)
                            continue

                        data_array = raw_stock_data.split("|")
                        stock_type = data_array[1]

                        logging.info(f"[분석] stock_type: {stock_type}")

                        if stock_type == TradeType.H0STCNT0:
                            stock_transaction = parse_stock_data(data_array[3])

                            stock_code = stock_transaction.stock_code
                            stock_price = stock_transaction.current_price

                            logging.info(f"[분석] stock_code: {stock_code}")
                            logging.info(f"[분석] stock_price: {stock_price}")

                            await redis_repository.save(stock_code, stock_price, REDIS_STOCK_EXPIRE)

                except websocket.WebSocketConnectionClosedException:
                    break
                finally:
                    timer_thread.join()

                ws.close()
                ws.connect(URL, ping_interval=PING_INTERVAL)
    finally:
        ws.close()


if __name__ == "__main__":
    asyncio.run(main())
