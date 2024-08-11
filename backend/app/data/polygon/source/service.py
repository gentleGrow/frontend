import asyncio
import json
import logging
import os

from dotenv import find_dotenv, load_dotenv

from app.data.common.constant import STOCK_CACHE_SECOND
from app.data.polygon.source.constant import ALL_STOCK
from database.redis import redis_repository

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv(find_dotenv())
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")


async def handle_message(message):
    realtime_stock = json.loads(message)
    for stock_data in realtime_stock:
        await redis_repository.save(stock_data["sym"], stock_data["vw"], expire_time=STOCK_CACHE_SECOND)


def on_message_sync(ws, message, loop):
    asyncio.run_coroutine_threadsafe(handle_message(message), loop)


def on_error(ws, error):
    logging.error(f"on_error : {error=}")


def on_close(ws):
    logging.info("### closed ###")


def on_open(ws):
    auth_data = {"action": "auth", "params": POLYGON_API_KEY}
    ws.send(json.dumps(auth_data))

    subscribe_message = {"action": "subscribe", "params": ALL_STOCK}
    ws.send(json.dumps(subscribe_message))
