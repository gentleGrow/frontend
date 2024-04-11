import json
from os import getenv

import pandas
import requests
import websocket
from dotenv import load_dotenv

load_dotenv()

KOREA_INVESTMENT_KEY = getenv("KOREA_INVESTMENT_KEY", None)
KOREA_INVESTMENT_SECRET = getenv("KOREA_INVESTMENT_SECRET", None)
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)


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


def parse_error_stock_data(data: str) -> None:
    jsonObject = json.loads(data)
    trid = jsonObject["header"]["tr_id"]

    if trid != "PINGPONG":
        rt_cd = jsonObject["body"]["rt_cd"]
        if rt_cd == "1":
            print("### ERROR RETURN CODE [ %s ] MSG [ %s ]" % (rt_cd, jsonObject["body"]["msg1"]))
            pass
        elif rt_cd == "0":
            print("### RETURN CODE [ %s ] MSG [ %s ]" % (rt_cd, jsonObject["body"]["msg1"]))

            if trid == "K0STCNI0" or trid == "K0STCNI9" or trid == "H0STCNI0" or trid == "H0STCNI9":
                aes_key = jsonObject["body"]["output"]["key"]
                aes_iv = jsonObject["body"]["output"]["iv"]
                print("### TRID [%s] KEY[%s] IV[%s]" % (trid, aes_key, aes_iv))

    elif trid == "PINGPONG":
        print("### RECV [PINGPONG] [%s]" % (data))
        print("### SEND [PINGPONG] [%s]" % (data))


def parse_stock_name_price(data: str) -> list[str]:
    data_array = data.split("^")
    stock_code = data_array[0]
    stock_price = data_array[2]
    return [stock_code, stock_price]


def subscribe_to_stock_batch(approval_key: str, batch: list[tuple[str, str]], ws: websocket) -> None:
    for stock_code, stock_name in batch:
        subscription_msg = {
            "header": {"approval_key": approval_key, "custtype": "P", "tr_type": "1", "content-type": "utf-8"},
            "body": {"input": {"tr_id": "H0STCNT0", "tr_key": stock_code}},
        }

        ws.send(json.dumps(subscription_msg))
