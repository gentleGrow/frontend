## [실행 방법]

### 서버 실행 방법
1. backend 폴더 안에 .env 파일을 추가합니다.
2. make up을 실행합니다.

### 개발 환경 세팅 (mac)
[주의] 파이썬 버전 3.10이상 필요
[주의] 테스트시 반드시 포트 8000으로 실행해야합니다.
1. cd /assetmanagement/backend
2. curl -sSL https://install.python-poetry.org | python3 -
3. export PATH="$HOME/.local/bin:$PATH" 혹은 export PYTHONPATH=$(pwd)
4. source ~/.zshrc
5. poetry shell
6. poetry install
7. uvicorn main:app --reload --port 8000
[주의] windows 실행 시, poetry env use C:\Users\GROUP4_KCW\AppData\Local\Programs\Python\Python311\python.exe로 명시적 버전 설정 필요


### 쿼리 삭제
DELETE FROM asset_stock
WHERE asset_id IN (
    SELECT id FROM asset WHERE user_id = 11
);

DELETE FROM asset WHERE user_id = 11;


### pre-commit 세팅
1. cd /assetmanagement/.git/hooks
2. touch pre-commit
#!/bin/sh
exec pre-commit run --all-files "$@"
3. chmod +x pre-commit

### Redis 실행 (mac)
- brew services start redis
- brew services info redis

### Redis 실행 (window)
- wsl -l -v
- wsl -d 설치한 리눅스 버전
- redis-server
- redis-cli
- ping

### 폴더 구조 확인
- tree -I '__pycache__'


### Docker 설치 및 실행
1. sudo apt-get update
2. sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
3. curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
4. sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
5. sudo apt-get update
6. sudo apt-get install -y docker-ce
7. sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
8. sudo chmod +x /usr/local/bin/docker-compose
9. docker-compose up -d --build
10. docker-compose down
11. docker exec -it containerId /bin/sh

docker rmi -f $(docker images -q)
docker build -t my-fastapi-app .
docker run -p 8000:8000 --env-file .env my-fastapi-app
