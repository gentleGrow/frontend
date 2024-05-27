#!/bin/bash

mkdir -p /home/logs

/usr/bin/python3 ./data/stock/stock_codes.py
/usr/bin/python3 ./data/stock/stock_codes.py >> /home/logs/stock_codes.log 2>&1

echo "초기 셋업에 성공하였습니다."
