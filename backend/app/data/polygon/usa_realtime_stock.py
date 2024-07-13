import os

from dotenv import find_dotenv, load_dotenv
from polygon import WebSocketClient

from app.data.polygon.source.constant import ALL_STOCK
from app.data.polygon.source.service import handle_msg

load_dotenv(find_dotenv())
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")

ploygon_websocket_client = WebSocketClient(api_key="POLYGON_API_KEY")
ploygon_websocket_client.subscribe(ALL_STOCK)
ploygon_websocket_client.run(handle_msg)
