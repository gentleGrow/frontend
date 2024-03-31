from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.api.auth.v1.router import auth_router
from database.config import MySQLBase, engine

app = FastAPI()

# [주의] production에서는 절대 사용하지 않습니다!!!
MySQLBase.metadata.create_all(bind=engine)
load_dotenv()

SESSION_KEY = getenv("SESSION_KEY", None)

app.add_middleware(SessionMiddleware, secret_key=SESSION_KEY)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
