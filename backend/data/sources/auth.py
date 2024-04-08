import json
from os import getenv

import requests
from dotenv import load_dotenv
from fastapi import status

load_dotenv()
KOREA_URL_BASE = getenv("KOREA_URL_BASE", None)


def get_access_token(app_key: str, app_secret: str) -> str:
    headers = {"content-type": "application/json"}
    body = {"grant_type": "client_credentials", "appkey": app_key, "appsecret": app_secret}
    PATH = "oauth2/tokenP"
    URL = f"{KOREA_URL_BASE}/{PATH}"
    res = requests.post(URL, headers=headers, data=json.dumps(body))
    result = res.json()["access_token"]
    return result


def get_approval_key(appkey: str, secretkey: str) -> str | None:
    url = f"{KOREA_URL_BASE}/oauth2/Approval"
    headers = {"Content-Type": "application/json; utf-8"}

    payload = {"grant_type": "client_credentials", "appkey": appkey, "secretkey": secretkey}

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == status.HTTP_200_OK:
        return response.json().get("approval_key")
    return None
