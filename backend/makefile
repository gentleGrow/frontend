SERVICE_FASTAPI=fastapi
SERVICE_DB=db
SERVICE_REDIS=redis

all: build up

build:
	docker-compose build

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

logs-db:
	docker-compose logs -f $(SERVICE_DB)

logs-redis:
	docker-compose logs -f $(SERVICE_REDIS)

shell-fastapi:
	docker-compose exec $(SERVICE_FASTAPI) /bin/bash

rebuild: build up

.PHONY: all build up down clean logs logs-fastapi logs-db logs-redis shell-fastapi rebuild
