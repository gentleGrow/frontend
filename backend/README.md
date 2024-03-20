## [실행 방법]
### application 실행
[주의] 파이썬 버전 3.10이상 필요
[주의] 테스트시 반드시 포트 8000으로 실행해야합니다.
- curl -sSL https://install.python-poetry.org | python3 -
- export PATH="$HOME/.local/bin:$PATH"
- source ~/.zshrc
- poetry shell
- poetry install
1. cd /assetmanagement/backend
2. python3 -m venv venv
3. source ./venv/bin/activate
4. pip install -r requirements
5. touch .env
6. uvicorn main:app --reload --port 8000

- brew services start redis
- brew services list

### 테스트 실행
- pytest

### Redis 실행 (mac)
- brew services start redis
- brew services info redis

### black 실행
- black .
- black path/file.py

### isort 실행
- isort .
- isort path/file.py

### mypy 실행
- mypy .
- mypy path/file.py

## [프로젝트 참조사항]
### 코드리뷰
- 불필요한 주석 제거[V]
- models.py > provider > type enum 설정
- env setting > pydantic 사용 [참조] https://docs.pydantic.dev/latest/concepts/pydantic_settings/
- role > nullable이 아닌 기본값 설정
- 리턴 타입 설정
- status code 매직 넘버가 아닌 HTTPStatus.BAD_REQUEST 처리
- 상태코드 명시적으로 표시 > 400x, 401 혹은 403처럼 명시적 코드 제시
- pre-commit > black, isort, mypy, flake8 [참조] https://medium.com/daangn/%ED%8C%8C%EC%9D%B4%EC%8D%AC%EC%9D%84-%EC%B2%98%EC%9D%8C-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EB%8F%99%EB%A3%8C%EC%99%80-%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%9D%BC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-bb52c3a433fa [V]
- enum 클래스 > 별도 enums.py에 옮깁니다. [V]
- snake case 처리로 변경 > auth_router > authRouter [V]
- fixture는 conftest.py에 옮깁니다. > db_session 등등
- db_handler는 상속 대신해 composition으로 전달합니다.
    - CRUD_repository 클래스를 만든 후, 특별한 로직이 담길 경우 CRUD_repository를 상속받는 식으로 진행하는 건 괜찮습니다.
- JSONRespones 대시해, response model를 만들어 반환하는 식으로 하여서 반환하는 객체의 직렬화 및 타입 체킹을 합니다. [참조] https://fastapi.tiangolo.com/ko/tutorial/response-model/
- 매직넘버나 상수는 constants.py에 모아서 관리합니다.


### Model
- Mixin
    - TimeStampMixin [참조] https://docs.sqlalchemy.org/en/13/orm/extensions/declarative/mixins.html#mixing-in-columns

### 버전관리
- poetry

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
.
├── README.md
├── __pycache__
│   └── main.cpython-39.pyc
├── app
│   ├── __init__.py
│   ├── api
│   │   ├── __init__.py
│   │   └── v1
│   │       ├── __init__.py
│   │       └── auth
│   │           ├── README.md
│   │           ├── __init__.py
│   │           └── router.py
│   ├── common
│   │   ├── __init__.py
│   │   └── auth
│   │       ├── __init__.py
│   │       ├── config.py
│   │       ├── jwt.py
│   │       └── social_auth.py
│   ├── dependencies
│   │   ├── __init__.py
│   │   └── dependencies.py
│   └── modules
│       ├── __init__.py
│       └── auth
│           ├── __init__.py
│           ├── handlers.py
│           ├── models.py
│           ├── repository.py
│           ├── schemas.py
│           └── service
│               ├── __init__.py
│               ├── google.py
│               ├── kakao.py
│               └── naver.py
├── data
│   └── finance_reader.py
├── database
│   ├── __init__.py
│   └── config.py
├── main.py
├── pytest.ini
├── requirements.txt
└── test # 테스트 부분은 app 폴더 이하의 구조와 똑같이 가져 갑니다
