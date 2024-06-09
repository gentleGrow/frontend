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
