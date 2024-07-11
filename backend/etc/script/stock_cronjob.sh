#!/bin/bash

crontab -l > mycron

echo "0 6 * * * python ./data/yahoo/stock_historical.py" >> mycron

crontab mycron
rm mycron

echo "성공적으로 cron job이 세팅되었습니다."
