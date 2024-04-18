import json
import logging
from os import getenv

import pandas
import requests
import websocket
from dotenv import load_dotenv
from pydantic import ValidationError

from data.sources.enums import SuccessCode, TradeType
from data.sources.schemas import StockData, StockTransaction

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)


def get_stock_code_list() -> list:
    korea_filepath = "./etc/files/korea_stock_list.xlsx"
    etf_filepath = "./etc/files/etf_stock_list.xlsx"
    japan_filepath = "./etc/files/japan_stock_list.xlsx"
    nas_filepath = "./etc/files/nas_stock_list.xlsx"
    nys_filepath = "./etc/files/nys_stock_list.xlsx"
    korea_stock_code_list = read_stock_codes_from_excel(korea_filepath)
    etf_stock_code_list = read_stock_codes_from_excel(etf_filepath)
    japan_stock_code_list = read_stock_codes_from_excel(japan_filepath)
    nas_stock_code_list = read_stock_codes_from_excel(nas_filepath)
    nys_stock_code_list = read_stock_codes_from_excel(nys_filepath)
    return (
        korea_stock_code_list + etf_stock_code_list + japan_stock_code_list + nas_stock_code_list + nys_stock_code_list
    )


def get_current_price(access_token: str, code: str) -> int:
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
    res = requests.get(
        f"{KOREA_URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-price", headers=headers, params=params
    )

    return int(res.json()["output"]["stck_prpr"])


def read_stock_codes_from_excel(filepath: str) -> list[tuple[str, str]]:
    df = pandas.read_excel(filepath, usecols=[0, 1], header=None)
    return list(zip(df[0], df[1]))


def socket_subscribe_message(stock_data: StockData) -> None:
    trid = stock_data["header"]["tr_id"]

    logging.info(f"[분석] trid : {trid}")

    if trid == TradeType.PINGPONG:
        logging.info("RECV [PINGPONG] [%s]", stock_data)
        logging.info("SEND [PINGPONG] [%s]", stock_data)
        return

    rt_cd = stock_data["body"]["rt_cd"]

    if rt_cd == SuccessCode.fail:
        logging.error(("### ERROR RETURN CODE [ %s ] MSG [ %s ]" % (rt_cd, stock_data["body"]["msg1"])))
        return

    if rt_cd == SuccessCode.success:
        logging.info("RETURN CODE [ %s ] MSG [ %s ]", rt_cd, stock_data["body"]["msg1"])

        if (
            trid == TradeType.K0STCNI0
            or trid == TradeType.K0STCNI9
            or trid == TradeType.H0STCNT0
            or trid == TradeType.H0STCNI9
        ):
            aes_key = stock_data["body"]["output"]["key"]
            aes_iv = stock_data["body"]["output"]["iv"]
            logging.info("TRID [%s] KEY[%s] IV[%s]", trid, aes_key, aes_iv)


def subscribe_to_stock_batch(approval_key: str, batch: list[tuple[str, str]], ws: websocket) -> None:
    for stock_code, stock_name in batch:
        subscription_msg = {
            "header": {"approval_key": approval_key, "custtype": "P", "tr_type": "1", "content-type": "utf-8"},
            "body": {"input": {"tr_id": TradeType.H0STCNT0, "tr_key": str(stock_code)}},
        }

        ws.send(json.dumps(subscription_msg))


def parse_stock_data(data_string: str) -> StockTransaction | None:
    data_fields = data_string.split("^")

    field_names = [field for field in StockTransaction.model_fields]

    data_dict = dict(zip(field_names, data_fields))

    try:
        stock_transaction = StockTransaction(**data_dict)
        return stock_transaction
    except ValidationError as e:
        logging.error(f"Validation Error: {e}")
        return None
