SERVICE_FASTAPI=fastapi
SERVICE_STOCK_HOURLY=stock_hourly
SERVICE_REDISINSIGHT=redisinsight

all: build up

build:
	docker-compose build

fastapi:
	docker-compose build $(SERVICE_FASTAPI)
	docker-compose up -d --force-recreate $(SERVICE_FASTAPI)

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down -v

logs:
	docker-compose logs -f

logs-fastapi:
	docker-compose logs -f $(SERVICE_FASTAPI)

logs-redis-insight:
	docker-compose logs -f $(SERVICE_REDISINSIGHT)

logs-stock_hourly:
	docker-compose logs -f $(SERVICE_STOCK_HOURLY)

shell-fastapi:
	docker-compose exec $(SERVICE_FASTAPI) /bin/bash

rebuild: build up

prune: down
	-docker system prune -a --volumes -f

.PHONY: all build up down clean logs logs-fastapi logs-redis-insight logs-stock_hourly shell-fastapi rebuild prune
