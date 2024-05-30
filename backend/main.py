from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.api.asset_management.v1.router import asset_management_router
from app.api.auth.v1.router import auth_router
from app.modules.asset_management.models import StockTransaction  # noqa: F401 > table 생성 시 필요합니다.
from app.modules.auth.models import User  # noqa: F401 > table 생성 시 필요합니다.

app = FastAPI()

load_dotenv()

SESSION_KEY = getenv("SESSION_KEY", None)

app.add_middleware(SessionMiddleware, secret_key=SESSION_KEY)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(asset_management_router, prefix="/api/asset_management", tags=["asset_management"])
