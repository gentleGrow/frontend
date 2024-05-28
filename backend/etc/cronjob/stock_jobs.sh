#!/bin/bash

crontab -l > mycron

echo "0 6 * * * /usr/bin/python3 ./data/yahoo/stock_overseas.py >> /home/logs/cron.log 2>&1" >> mycron
echo "0 * * * * /usr/bin/python3 ./data/naver/stock_hourly.py >> /home/logs/cron.log 2>&1" >> mycron

crontab mycron
rm mycron

echo "성공적으로 cron job이 세팅되었습니다."
