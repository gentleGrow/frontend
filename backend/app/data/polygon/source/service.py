import asyncio
import json
from icecream import ic
import os
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from datetime import datetime
from dotenv import find_dotenv, load_dotenv
from app.data.common.constant import STOCK_CACHE_SECOND, REALTIME_BULK_SIZE
from app.data.polygon.source.constant import ALL_STOCK
from app.module.asset.redis_repository import RedisRealTimeStockRepository
from app.module.asset.repository.stock_minutely_repository import StockMinutelyRepository
from app.module.asset.model import StockMinutely
from database.dependency import get_redis_pool, get_mysql_session


class PolygonRealTimeService:
    def __init__(self):
        load_dotenv(find_dotenv())
        self.POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
        self.redis_client = get_redis_pool()

    def on_message_sync(self, ws, message, loop):
        asyncio.run_coroutine_threadsafe(self._pipeline(message), loop)

    async def _pipeline(self, message):
        async for stock_data in self._handle_message(message):
            await self._bulk_insert_to_db([stock_data])
            await self._save_to_redis([stock_data])

    async def _handle_message(self, message):
        stock_data_list = json.loads(message)

        for stock_data in stock_data_list:
            yield stock_data

    async def _save_to_redis(self, stock_data_list):
        redis_bulk_data = [(stock_data["sym"], stock_data["vw"]) for stock_data in stock_data_list]
        
        if redis_bulk_data:
            await RedisRealTimeStockRepository.bulk_save(self.redis_client, redis_bulk_data, STOCK_CACHE_SECOND)

    async def _bulk_insert_to_db(self, stock_data_list):
        db_bulk_data = []
        now = datetime.now().replace(second=0, microsecond=0)

        for stock_data in stock_data_list:
            try:
                stock_minutely = StockMinutely(
                    code=stock_data["sym"],
                    datetime=now,
                    current_price=float(stock_data["vw"])
                )
            except Exception as e:
                ic(f"{e=}")
            db_bulk_data.append(stock_minutely)

            ic(f"{len(db_bulk_data)=}")

            if len(db_bulk_data) >= REALTIME_BULK_SIZE:
                await self._bulk_save_to_db(db_bulk_data)
                db_bulk_data.clear()

        if db_bulk_data:
            await self._bulk_save_to_db(db_bulk_data)

    async def _bulk_save_to_db(self, db_bulk_data):
        async with get_mysql_session() as session:
            await StockMinutelyRepository.bulk_upsert(session, db_bulk_data)

    def on_open(self, ws):
        ic("WebSocket connection opened.")
        auth_data = {"action": "auth", "params": self.POLYGON_API_KEY}
        ws.send(json.dumps(auth_data))
        subscribe_message = {"action": "subscribe", "params": ALL_STOCK}
        ws.send(json.dumps(subscribe_message))

    def on_error(self, ws, error):
        ic(f"on_error: {error}")

    def on_close(self, ws, close_status_code, close_reason):
        ic(f"### closed ### close_status_code={close_status_code}, close_reason={close_reason}")
