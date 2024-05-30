#!/bin/bash

dockerize -wait tcp://${MYSQL_HOST}:3306 -timeout 60s

python ./database/create_tables.py

bash ./etc/scripts/main.sh

uvicorn main:app --host 0.0.0.0 --reload
