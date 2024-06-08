import json
from os import getenv

import requests
from dotenv import load_dotenv
from fastapi import status

load_dotenv()

KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)
KOREA_URL_WEBSOCKET = getenv("KOREA_URL_WEBSOCKET", None)


def get_access_token(app_key: str, app_secret: str) -> str:
    headers = {"content-type": "application/json"}
    body = {"grant_type": "client_credentials", "appkey": app_key, "appsecret": app_secret}
    URL = f"{KOREA_URL_BASE}/oauth2/tokenP"
    res = requests.post(URL, headers=headers, data=json.dumps(body))
    return res.json()["access_token"]


def get_approval_key(appkey: str, secretkey: str) -> str | None:
    URL = f"{KOREA_URL_BASE}/oauth2/Approval"
    headers = {"Content-Type": "application/json; utf-8"}

    payload = {"grant_type": "client_credentials", "appkey": appkey, "secretkey": secretkey}

    response = requests.post(URL, json=payload, headers=headers)

    if response.status_code == status.HTTP_200_OK:
        return response.json().get("approval_key")
    return None
