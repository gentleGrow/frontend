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

### 테스트 실행
1. pytest

### Redis 실행 (mac)
- brew services start redis
- brew services info redis

### [프로젝트 참조사항]
#### service
- Exception 처리
- type 정의

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
- 테스트 커버리지 적용

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

#### 코드 커밋
- [gitflow] main > develop > release > feature/내용 > hotfix * 단점 : ci/cd에 적합하지 않음, 장점 : 안전함 [x]
- [trun-base] main > feature * 단점 : 테스트 자동화 요구, 장점 : 적은 브런치 관리 [v]
- [참조] https://www.youtube.com/watch?v=EV3FZ3cWBp8

#### Design Patter
- Creational
    - Factory Method
    - Abstract Factory
    - Builder
    - Prototype
    - Singleton
- Structural
    - Adapter
    - Bridge
    - Composite
    - Decorator
    - Facade
    - Flyweight
    - Proxy
- Behavorial
    - Chain of Responsibility
    - Command
    - Iterator
    - Mediator
    - Memento
    - Observer
    - State
    - Strategy
    - Template Method
    - Visitor
- [참조] https://refactoring.guru/


#### 폴더 구조
backend
-api
--v1
---auth
----router
——-auth_router.py
----database
——-models.py
——-repository.py
——-schemas.py
----service
-----auth_service.py
-----config.py
-----google_service.py
-----naver_service.py
-----kakao_service.py
-data
—finance_reader.py
-database
—config.py
-dependencies
—dependencies.py
-test
—auth
—-database
——test_repository.py
—-service
——test_auth_service.py
——test_google_service.py
——test_kakao_service.py
——test_naver_service.py
