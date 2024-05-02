import asyncio
import json
import sys
import threading

import websocket

from data.sources.auth import (
    KOREA_INVESTMENT_KEY,
    KOREA_INVESTMENT_SECRET,
    KOREA_URL_WEBSOCKET,
    get_approval_key,
    logging,
)
from data.sources.constant import (
    MAXIMUM_WEBSOCKET_CONNECTION,
    PING_INTERVAL,
    REDIS_STOCK_EXPIRE_SECONDS,
    TIMEOUT_SECOND,
)
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


async def main():
    if KOREA_INVESTMENT_KEY is None or KOREA_INVESTMENT_SECRET is None:
        sys.exit(1)

    approval_key = get_approval_key(KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET)

    if approval_key is None:
        sys.exit(1)

    stock_code_list = get_realtime_stock_code_list()
    stock_code_chunks = list(divide_stock_list(stock_code_list, MAXIMUM_WEBSOCKET_CONNECTION))

    URL = f"{KOREA_URL_WEBSOCKET}/tryitout/H0STCNT0"
    ws = websocket.WebSocket()

    logging.info("실시간 웹 소켓을 실행합니다.")

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

                        if raw_stock_data[0] != "0":
                            stock_data = json.loads(raw_stock_data)
                            socket_subscribe_message(stock_data)
                            continue

                        data_array = raw_stock_data.split("|")
                        stock_type = data_array[1]

                        if stock_type == TradeType.stock_price:
                            stock_transaction = parse_stock_data(data_array[3])

                            stock_code = stock_transaction.stock_code
                            stock_price = stock_transaction.current_price

                            await redis_repository.save(stock_code, stock_price, REDIS_STOCK_EXPIRE_SECONDS)

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
