# Library
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from os import getenv
# Module
from database.config import Base
from api.v1.auth.router.auth_router import authRouter
from database.config import engine

app = FastAPI()

# [정보] .env 변수값을 environment에 설정합니다.
# [주의] production에서는 절대사용하지 않습니다!!!
Base.metadata.create_all(bind=engine)
load_dotenv()

SESSION_KEY = getenv('SESSION_KEY', None)

app.add_middleware(
    SessionMiddleware, 
    secret_key=SESSION_KEY
)

# [정보] 라우터를 설정합니다.
app.include_router(authRouter, prefix="/api/auth", tags=["auth"])

@app.get("/")
def read_root():
    return JSONResponse(content={"message": "Hello World"})
