import asyncio
import json
import sys
import threading

import websocket

from data.common.constant import MAXIMUM_WEBSOCKET_CONNECTION, PING_INTERVAL, REDIS_STOCK_EXPIRE_SECONDS, TIMEOUT_SECOND
from data.common.enums import TradeType
from data.common.service import get_realtime_stock_code_list
from data.korea_investment.sources.auth import KOREA_URL_WEBSOCKET, get_approval_key
from data.korea_investment.sources.config import KOREA_INVESTMENT_KEYS
from data.korea_investment.sources.schemas import StockTransaction
from data.korea_investment.sources.service import (
    divide_stock_list,
    parse_stock_data,
    set_timeout,
    socket_subscribe_message,
    subscribe_to_stock_batch,
)
from database.singleton import redis_stock_repository


async def connect_and_subscribe(approval_key, stock_code_chunks, index):
    URL = f"{KOREA_URL_WEBSOCKET}/tryitout/H0STCNT0"
    ws = websocket.WebSocket()

    try:
        ws.connect(URL, ping_interval=PING_INTERVAL)
        while True:
            for chunk in stock_code_chunks:
                # [FIX] > refactor timer logic into decorator or function
                timeout_flag = [False]
                timer_thread = threading.Thread(target=set_timeout, args=(TIMEOUT_SECOND, timeout_flag))
                timer_thread.start()

                subscribe_to_stock_batch(approval_key, chunk, ws)

                try:
                    while not timeout_flag[0]:
                        raw_stock_data = ws.recv()  # [FIX] > create ws.recv() return data type

                        if raw_stock_data[0] != "0":
                            stock_data = json.loads(raw_stock_data)
                            socket_subscribe_message(stock_data)
                            continue

                        data_array = raw_stock_data.split("|")
                        stock_type = data_array[1]

                        if stock_type == TradeType.STOCK_PRICE:
                            stock_transaction: StockTransaction | None = parse_stock_data(data_array[3])

                            stock_code = stock_transaction.stock_code
                            stock_price = stock_transaction.current_price

                            await redis_stock_repository.save(stock_code, stock_price, REDIS_STOCK_EXPIRE_SECONDS)

                except websocket.WebSocketConnectionClosedException:
                    break
                finally:
                    timer_thread.join()

                ws.close()
                ws.connect(URL, ping_interval=PING_INTERVAL)
    finally:
        ws.close()


async def main():
    stock_code_list = get_realtime_stock_code_list()
    chunks_per_key = len(stock_code_list) // len(KOREA_INVESTMENT_KEYS)
    tasks = []

    for i, (key, secret) in enumerate(KOREA_INVESTMENT_KEYS):
        approval_key = get_approval_key(key, secret)
        if approval_key is None:
            sys.exit(1)

        start = i * chunks_per_key
        end = (i + 1) * chunks_per_key if i != len(KOREA_INVESTMENT_KEYS) - 1 else len(stock_code_list)
        stock_code_chunks = list(divide_stock_list(stock_code_list[start:end], MAXIMUM_WEBSOCKET_CONNECTION))

        task = asyncio.create_task(connect_and_subscribe(approval_key, stock_code_chunks, i))
        tasks.append(task)

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
