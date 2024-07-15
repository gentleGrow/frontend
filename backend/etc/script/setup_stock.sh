#!/bin/bash

mkdir -p ./logs

python ./data/initial/create_table.py
python ./data/stock/stock_code.py
python ./data/yahoo/dividend.py
python ./data/yahoo/exchange_rate.py
python ./data/yahoo/stock_historical.py

python ./data/initial/insert_basic_data.py

echo "초기 셋업에 성공하였습니다."
