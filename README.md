## 실행 방법
### Backend
[주의] 파이썬 버전 3.10이상 필요
[주의] 테스트시 반드시 포트 8000으로 실행해야합니다.
1. cd /assetmanagement/backend
2. python3 -m venv venv 
3. source ./venv/bin/activate
4. pip install -r requirements
5. touch .env 
6. uvicorn main:app --reload --port 8000

### Frontend
1. cd /assetmanagement/frontend
2. sudo npm i
3. sudo npm run dev

### 코드 커밋
- [gitflow] main > develop > release > feature/내용 > hotfix * 단점 : ci/cd에 적합하지 않음, 장점 : 안전함
- [trun-base] main > feature * 단점 : 테스트 자동화 요구, 장점 : 적은 브런치 관리
- [참조] https://www.youtube.com/watch?v=EV3FZ3cWBp8


