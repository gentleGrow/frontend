import asyncio
import itertools
import json
import sys
import threading
from typing import Generator

import websocket

from app.module.asset.schema.stock_schema import RealtimeStockList
from data.common.constant import (
    MAXIMUM_STOCK_CODES_CONNECTION,
    PING_INTERVAL,
    REDIS_STOCK_EXPIRE_SECONDS,
    TIMEOUT_SECOND,
)
from data.common.enum import TradeType
from data.common.service import get_all_stock_code_list
from data.korea_investment.source.auth import KOREA_URL_WEBSOCKET, get_approval_key
from data.korea_investment.source.config import KOREA_INVESTMENT_KEYS
from data.korea_investment.source.schema import StockTransaction
from data.korea_investment.source.service import (
    divide_stock_list,
    parse_stock_data,
    set_timeout,
    socket_subscribe_message,
    subscribe_to_stock_batch,
)
from database.singleton import redis_stock_repository


async def connect_and_subscribe(
    approval_key: str, stock_code_generator: Generator[list[str], None, None], stock_code_chunks: list[str]
) -> None:
    URL = f"{KOREA_URL_WEBSOCKET}/tryitout/H0STCNT0"
    ws = websocket.WebSocket()

    try:
        ws.connect(URL, ping_interval=PING_INTERVAL)
        while True:
            try:
                chunk = next(stock_code_generator)
            except StopIteration:
                stock_code_generator = itertools.cycle(stock_code_chunks)  # type: ignore

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

                    if stock_type == TradeType.STOCK_PRICE:
                        stock_transaction: StockTransaction | None = parse_stock_data(data_array[3])

                        stock_code = stock_transaction.stock_code  # type: ignore
                        stock_price = stock_transaction.current_price  # type: ignore

                        await redis_stock_repository.save(stock_code, stock_price, REDIS_STOCK_EXPIRE_SECONDS)  # type: ignore

            except websocket.WebSocketConnectionClosedException:
                break
            finally:
                timer_thread.join()

            ws.close()
            ws.connect(URL, ping_interval=PING_INTERVAL)
    finally:
        ws.close()


async def main():
    stock_code_list: RealtimeStockList = get_all_stock_code_list()
    tasks = []

    stock_code_generators = [
        divide_stock_list(stock_code_list, MAXIMUM_STOCK_CODES_CONNECTION) for _ in KOREA_INVESTMENT_KEYS
    ]

    for i, (key, secret) in enumerate(KOREA_INVESTMENT_KEYS):
        approval_key = get_approval_key(key, secret)
        if approval_key is None:
            sys.exit(1)

        task = asyncio.create_task(connect_and_subscribe(approval_key, stock_code_generators[i], i))
        tasks.append(task)

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
