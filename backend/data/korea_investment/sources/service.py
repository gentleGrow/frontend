import json
import time
from typing import Generator

import requests
import websocket
from pydantic import ValidationError

from data.common.config import KOREA_INVESTMENT_KEY, KOREA_INVESTMENT_SECRET, KOREA_URL_BASE, logging
from data.common.enums import SuccessCode, TradeType
from data.common.schemas import realtimeStockList
from data.korea_investment.sources.schemas import StockData, StockTransaction


def divide_stock_list(stock_code_list: realtimeStockList, chunk_size: int) -> Generator[list[str], None, None]:
    stock_codes = [stock.code for stock in stock_code_list.stocks]
    for idx in range(0, len(stock_codes), chunk_size):
        yield stock_codes[idx : idx + chunk_size]


def set_timeout(timeout_seconds: int, flag: list):
    time.sleep(timeout_seconds)
    flag[0] = True


def get_oversea_current_price(access_token: str, stock_code: str, excd: str) -> int | None:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "appKey": KOREA_INVESTMENT_KEY,
        "appSecret": KOREA_INVESTMENT_SECRET,
        "tr_id": "HHDFS00000300",
        "custtype": "P",
    }

    params = {"AUTH": "", "EXCD": excd, "SYMB": stock_code}

    url = f"{KOREA_URL_BASE}/uapi/overseas-price/v1/quotations/price"
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return int(response.json()["output"]["stck_prpr"])
    else:
        return None


def get_korea_current_price(access_token: str, stock_code: str) -> int:
    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {access_token}",
        "appKey": KOREA_INVESTMENT_KEY,
        "appSecret": KOREA_INVESTMENT_SECRET,
        "tr_id": "FHKST01010100",
        "custtype": "P",
    }

    params = {
        "FID_COND_MRKT_DIV_CODE": "J",
        "FID_INPUT_ISCD": stock_code,
    }

    try:
        res = requests.get(
            f"{KOREA_URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-price", headers=headers, params=params
        )
        res.raise_for_status()
        return int(res.json()["output"]["stck_prpr"])
    except requests.exceptions.HTTPError as e:
        if res.status_code == 500:
            raise ValueError("Server error occurred while fetching stock price.") from e
        else:
            raise e


def socket_subscribe_message(stock_data: StockData) -> None:
    trid = stock_data["header"]["tr_id"]

    if trid == TradeType.END_STOCK_TIME:
        logging.info(f"RECV [PINGPONG] [{stock_data=}]")
        return

    rt_cd = stock_data["body"]["rt_cd"]

    if rt_cd == SuccessCode.FAIL:
        return

    if rt_cd == SuccessCode.SUCCESS:
        if (
            trid == TradeType.K0STCNI0
            or trid == TradeType.K0STCNI9
            or trid == TradeType.STOCK_PRICE
            or trid == TradeType.MOCK_STOCK_EXECUTION
        ):
            return


def subscribe_to_stock_batch(approval_key: str, batch: list[str], ws: websocket) -> None:
    for stock_code in batch:
        subscription_msg = {
            "header": {"approval_key": approval_key, "custtype": "P", "tr_type": "1", "content-type": "utf-8"},
            "body": {"input": {"tr_id": TradeType.STOCK_PRICE, "tr_key": str(stock_code)}},
        }

        ws.send(json.dumps(subscription_msg))


def parse_stock_data(data_string: str) -> StockTransaction | None:
    data_fields = data_string.split("^")

    field_names = [field for field in StockTransaction.model_fields]

    data_dict = dict(zip(field_names, data_fields))

    try:
        stock_transaction = StockTransaction(**data_dict)
        return stock_transaction
    except ValidationError:
        return None
