#!/bin/bash

# Activate the virtual environment
source /opt/pysetup/.venv/bin/activate

mkdir -p ./logs

python ./data/stock/stock_codes.py >> ./logs/stock_codes.log 2>&1

echo "초기 셋업에 성공하였습니다."
