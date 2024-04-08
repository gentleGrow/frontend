import json
from os import getenv

import pandas
import requests
import websockets
from dotenv import load_dotenv

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)
KOREA_URL_WEBSOCKET = getenv("KOREA_URL_WEBSOCKET", None)


def get_current_price(access_token: str, code: str) -> int:
    PATH = "uapi/domestic-stock/v1/quotations/inquire-price"
    URL = f"{KOREA_URL_BASE}/{PATH}"

    headers = {
        "Content-Type": "application/json",
        "authorization": f"Bearer {access_token}",
        "appKey": KOREA_INVESTMENT_KEY,
        "appSecret": KOREA_INVESTMENT_SECRET,
        "tr_id": "FHKST01010100",
    }
    params = {
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": code,
    }
    res = requests.get(URL, headers=headers, params=params)

    return int(res.json()["output"]["stck_prpr"])


def read_stock_codes_from_excel(filepath: str) -> list[tuple[str, str]]:
    df = pandas.read_excel(filepath, usecols=[0, 1], header=None, skiprows=1)
    stock_codes = list(zip(df[0], df[1]))
    return stock_codes


async def batch_subscribe_to_stocks(approval_key: str, stock_code_list: list[tuple[str, str]], batch_size: int):
    for i in range(0, len(stock_code_list), batch_size):
        batch = stock_code_list[i : i + batch_size]
        await subscribe_to_stock_batch(approval_key, batch)


async def subscribe_to_stock_batch(approval_key: str, batch: list[tuple[str, str]]):
    PATH = "tryitout/H0STCNT0"
    ws_uri = f"{KOREA_URL_WEBSOCKET}/{PATH}"
    async with websockets.connect(ws_uri) as websocket:
        for stock_code, stock_name in batch:
            subscription_msg = {
                "header": {"approval_key": approval_key, "custtype": "P", "tr_type": "1", "content-type": "utf-8"},
                "body": {"input": {"tr_id": "H0STCNT0", "tr_key": stock_code}},
            }
            await websocket.send(json.dumps(subscription_msg))

        while True:
            message = await websocket.recv()
            print(message)
