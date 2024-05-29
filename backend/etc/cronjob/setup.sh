#!/bin/bash

mkdir -p /code/logs

/usr/bin/python3 /code/data/stock/stock_codes.py >> /code/logs/stock_codes.log 2>&1

echo "초기 셋업에 성공하였습니다."
