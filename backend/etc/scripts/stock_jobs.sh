#!/bin/bash

crontab -l > mycron

echo "0 6 * * * python ./data/yahoo/stock_overseas.py >> ./logs/cron.log 2>&1" >> mycron
echo "0 * * * * python ./data/naver/stock_hourly.py >> ./logs/cron.log 2>&1" >> mycron

crontab mycron
rm mycron

echo "성공적으로 cron job이 세팅되었습니다."
