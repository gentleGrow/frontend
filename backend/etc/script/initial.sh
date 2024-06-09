#!/bin/bash

dockerize -wait tcp://${MYSQL_HOST}:3306 -timeout 60s

source /opt/pysetup/.venv/bin/activate

bash ./etc/script/setup_stock.sh
bash ./etc/script/stock_cronjob.sh



uvicorn main:app --host 0.0.0.0 --reload
