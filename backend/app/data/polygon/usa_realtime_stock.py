import os

import websocket
from dotenv import find_dotenv, load_dotenv

from app.data.polygon.source.service import on_close, on_error, on_message, on_open

load_dotenv(find_dotenv())

POLYGON_WS_URL = os.getenv("POLYGON_WS_URL")


def main():
    ws = websocket.WebSocketApp(POLYGON_WS_URL, on_message=on_message, on_error=on_error, on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()


if __name__ == "__main__":
    main()
