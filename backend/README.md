## [실행 방법]

### 서버 실행 방법
1. backend 폴더 안에 .env 파일을 추가합니다.
2. make up을 실행합니다.
3. Api 명세서는 다음 링크에서 확인합니다 : http://localhost:8000/docs
4. 아래 이미지를 참고하십시오:
![Docker Container](./etc/readme/dockercontainer.PNG)
- Docker containers : db, redis, redisinsight, fastapi가 정상 실행되는지 확인합니다.
- 정상적으로 실행되지 않다면 .env파일을 확인해서 db 경로가 올바로 되어 있는지 확인합니다.
![Redis Insight](./etc/readme/redisinsight1.PNG)
- redis 데이터가 자동으로 수집 됩니다.
- Add connection details manually를 눌러 redis와 연결합니다.
![Redis Insight](./etc/readme/redisinsight2.PNG)
- Host 명을 redis로 변경합니다.
- Database Alias는 redis:6379로 변경합니다.
![Redis Insight](./etc/readme/redisinsight3.PNG)
- 연결된 데이터베이스를 클릭합니다.
![Redis Insight](./etc/readme/redisinsight4.PNG)
- stock_code : stock_price 형태로 저장되어 있는걸 확인합니다.

### 개발 환경 세팅 (mac)
[주의] 파이썬 버전 3.10이상 필요
[주의] 테스트시 반드시 포트 8000으로 실행해야합니다.
1. cd /assetmanagement/backend
2. curl -sSL https://install.python-poetry.org | python3 -
3. export PATH="$HOME/.local/bin:$PATH"
4. source ~/.zshrc
5. poetry shell
6. poetry install
7. uvicorn main:app --reload --port 8000

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
