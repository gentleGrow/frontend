from fastapi import FastAPI
from app.database.config import Base
from app.router.login_router import loginRouter
from app.database.config import engine

#[정보] Base 객체를 상속받은 모든 클래스 정보를 담습니다. 애플리케이션 실행 전에, 정의된 테이블이 존재하지 않으면 추가합니다.
#[주의] production에서는 사용하지 않습니다.
Base.metadata.create_all(bind=engine)
app = FastAPI()

# [정보] 라우터를 설정합니다.
app.include_router(loginRouter, prefix="/api/login", tags=["login"])


