#!/bin/bash
sudo docker stop korea_realtime_market_index_container
sudo docker rm korea_realtime_market_index_container
sudo docker run -d --name korea_realtime_market_index_container korea_realtime_market_index
