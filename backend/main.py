from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.api.auth.v1.router import auth_router
from app.modules.asset_management.models import StockTransaction  # noqa: F401 > relationship 설정시 필요합니다.
from app.modules.auth.models import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.config import MySQLBase, mysql_engine

app = FastAPI()

load_dotenv()

SESSION_KEY = getenv("SESSION_KEY", None)

app.add_middleware(SessionMiddleware, secret_key=SESSION_KEY)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

# [주의] production에서는 절대 사용하지 않습니다!!!
if getenv("ENVIRONMENT") == "development":
    MySQLBase.metadata.create_all(bind=mysql_engine)
