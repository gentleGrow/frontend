import asyncio
import json
import logging
import os

from dotenv import find_dotenv, load_dotenv

from app.data.common.constant import STOCK_CACHE_SECOND
from app.data.polygon.source.constant import ALL_MARKET_INDEX, ALL_STOCK
from app.module.asset.redis_repository import RedisRealTimeStockRepository
from app.module.chart.redis_repository import RedisMarketIndiceRepository
from database.dependency import get_redis_pool

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv(find_dotenv())
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
redis_client = get_redis_pool()


async def handle_message(message):
    realtime_stock = json.loads(message)
    for stock_data in realtime_stock:
        await RedisRealTimeStockRepository.save(
            redis_client, stock_data["sym"], stock_data["vw"], expire_time=STOCK_CACHE_SECOND
        )


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


async def handle_market_index_message(message):
    realtime_market_index = json.loads(message)

    for index_data in realtime_market_index:
        redis_key = f"{index_data['sym']}"
        market_index_value = json.dumps(index_data)

        await RedisMarketIndiceRepository.save(
            redis_client, redis_key, market_index_value, expire_time=STOCK_CACHE_SECOND
        )


def on_message_market_index(ws, message, loop):
    asyncio.run_coroutine_threadsafe(handle_market_index_message(message), loop)


def on_open_market_index(ws):
    auth_data = {"action": "auth", "params": POLYGON_API_KEY}
    ws.send(json.dumps(auth_data))

    subscribe_message = {"action": "subscribe", "params": ALL_MARKET_INDEX}
    ws.send(json.dumps(subscribe_message))
