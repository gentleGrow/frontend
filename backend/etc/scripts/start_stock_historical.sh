#!/bin/bash
sudo docker stop stock_historical_container
sudo docker rm stock_historical_container
sudo docker run -d --name stock_historical_container stock_historical
