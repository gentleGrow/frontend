#!/bin/bash
sudo docker stop usa_stock_task_container
sudo docker rm usa_stock_task_container
sudo docker run -d --name usa_stock_task_container usa_realtime_stock
