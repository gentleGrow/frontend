#!/bin/bash
sudo docker stop world_realtime_market_index_container
sudo docker rm world_realtime_market_index_container
sudo docker run -d --name world_realtime_market_index_container world_realtime_market_index
