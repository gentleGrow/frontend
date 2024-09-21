import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from database.dependency import get_redis_pool
from app.common.auth.security import verify_jwt_token
from database.config import MySQLBase
from main import app
from os import getenv
from dotenv import load_dotenv

load_dotenv()


TEST_DATABASE_URL = getenv("ENVIRONMENT", None)

test_engine = create_async_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestSessionLocal = sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function", autouse=True)
async def init_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(MySQLBase.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(MySQLBase.metadata.drop_all)


@pytest.fixture(scope="function")
async def db_session():
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()


@pytest.fixture(scope="function")
async def redis_client():
    redis = get_redis_pool() 
    yield redis
    await redis.close() 
        

def override_verify_jwt_token():
    return {"user": 999}


@pytest.fixture(scope="function")
def override_dependencies():
    app.dependency_overrides[verify_jwt_token] = override_verify_jwt_token
    yield
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client(override_dependencies):
    with TestClient(app) as c:
        yield c
