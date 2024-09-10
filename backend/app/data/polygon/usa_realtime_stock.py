import asyncio
import os
import threading
import time
from icecream import ic
import websocket
from dotenv import find_dotenv, load_dotenv
from app.data.polygon.source.service import PolygonRealTimeService

load_dotenv(find_dotenv())
POLYGON_WS_URL = os.getenv("POLYGON_WS_STOCK_URL")


class USARealTimeStock:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.loop = asyncio.get_event_loop()
        self.websocket_thread = None
        self.service = PolygonRealTimeService()  

    def start(self):
        self.websocket_thread = threading.Thread(target=self._start_websocket)
        self.websocket_thread.start()
        self.loop.run_forever()

    def _start_websocket(self):
        asyncio.set_event_loop(self.loop)

        while True:
            ws = websocket.WebSocketApp(
                self.ws_url,
                on_message=self._on_message,
                on_error=self._on_error,
                on_close=self._on_close
            )
            ws.on_open = self._on_open
            ws.run_forever()
            time.sleep(5)

    def _on_message(self, ws, message):
        self.service.on_message_sync(ws, message, self.loop)

    def _on_error(self, ws, error):
        self.service.on_error(ws, error)

    def _on_close(self, ws, close_status_code, close_reason):
        self.service.on_close(ws, close_status_code, close_reason)  # Pass both status code and reason

    def _on_open(self, ws):
        self.service.on_open(ws)


if __name__ == "__main__":
    usa_stock = USARealTimeStock(POLYGON_WS_URL)
    usa_stock.start()
