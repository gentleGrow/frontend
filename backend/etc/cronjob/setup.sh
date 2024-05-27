#!/bin/bash

mkdir -p /home/logs

/usr/bin/python3 ./data/stock/stock_codes.py
/usr/bin/python3 ./data/stock/stock_codes.py >> /home/logs/stock_codes.log 2>&1
