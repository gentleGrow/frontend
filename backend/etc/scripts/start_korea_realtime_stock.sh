#!/bin/bash
sudo docker stop korea_stock_task_container
sudo docker rm korea_stock_task_container
sudo docker run -d --name korea_stock_task_container korea_realtime_stock
