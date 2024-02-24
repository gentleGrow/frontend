### [정보] 
#### 실행
[주의] 파이썬 버전 3.10이상 필요
[주의] 테스트시 반드시 포트 8000으로 실행해야합니다.
1. cd /assetmanagement/backend
2. python3 -m venv venv 
3. source ./venv/bin/activate
4. pip install -r requirements
5. touch .env 
6. uvicorn main:app --reload --port 8000

### [추가 내용]
#### service
- Exception 처리

#### main.py
- Database Connection Pool 설정
- Close Event
- CORS Middleware
- Logging Configuration

#### test
- mocking
- integration test
- unit test
- e2e test

#### log
- logger
- 감시설정
- 의미 있는 로그 전달 혹은 민감 로그 숨김

#### api 명세서
- 요청에 필요한 헤더와 바디 
- 응답에 필요한 헤더와 바디
- api 플로우
- 각 api별 설명
- 응답 실패에 대한 예시
- API 설계시 통일된 규칙 적용
    - 네이밍
    - 반환타입
    - JSON 구조
    - 로직 적용 > 정렬, 변환
- [참조] https://www.youtube.com/watch?v=r03ObslCNlo


