import json
import logging
import os

from dotenv import find_dotenv, load_dotenv

from app.data.polygon.source.schema import RealTimeStock
from database.redis import redis_repository

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv(find_dotenv())
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")


def on_message(ws, message):
    realtime_stock = json.loads(message)
    for stock_data in realtime_stock:
        stock = RealTimeStock(sym=stock_data["sym"], vw=stock_data["vw"])
        redis_repository.save(stock_data["sym"], stock)


def on_error(ws, error):
    logging.error(f"on_error : {error=}")


def on_close(ws):
    logging.info("### closed ###")


def on_open(ws):
    auth_data = {"action": "auth", "params": POLYGON_API_KEY}
    ws.send(json.dumps(auth_data))

    subscribe_message = {"action": "subscribe", "params": "AM.*"}
    ws.send(json.dumps(subscribe_message))
