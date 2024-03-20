from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware

from app.api.auth.v1.router import authRouter
from database.config import PostgresBase, engine

app = FastAPI()

# [주의] production에서는 절대 사용하지 않습니다!!!
PostgresBase.metadata.create_all(bind=engine)
load_dotenv()

SESSION_KEY = getenv("SESSION_KEY", None)

app.add_middleware(SessionMiddleware, secret_key=SESSION_KEY)

app.include_router(authRouter, prefix="/api/auth", tags=["auth"])


@app.get("/")
def read_root():
    return JSONResponse(content={"message": "Hello World"})
