#!/bin/bash
sudo docker stop korea_realtime_stock_container
sudo docker rm korea_realtime_stock_container
sudo docker run -d --name korea_realtime_stock_container korea_realtime_stock
