from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.common.auth.security import verify_jwt_token
from database.config import MySQLBase
from main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

test_engine = create_async_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestSessionLocal = sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
async def init_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(MySQLBase.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(MySQLBase.metadata.drop_all)


@pytest.fixture(scope="function")
async def db_session(init_db):
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()


@pytest.fixture(scope="function")
def mock_redis_repositories():
    with patch("app.module.asset.redis_repository.RedisRealTimeStockRepository.bulk_get", return_value=[]), patch(
        "app.module.asset.redis_repository.RedisRealTimeStockRepository.save", return_value=None
    ), patch("app.module.asset.redis_repository.RedisExchangeRateRepository.bulk_get", return_value=[]), patch(
        "app.module.asset.redis_repository.RedisExchangeRateRepository.save", return_value=None
    ), patch(
        "app.module.auth.redis_repository.RedisSessionRepository.get", return_value=None
    ), patch(
        "app.module.auth.redis_repository.RedisSessionRepository.save", return_value=None
    ), patch(
        "app.module.chart.redis_repository.RedisTipRepository.get", return_value=None
    ), patch(
        "app.module.chart.repository.TipRepository.get", return_value=None
    ):
        yield


def override_verify_jwt_token():
    return {"user": 999}


@pytest.fixture(scope="module")
def override_dependencies():
    app.dependency_overrides[verify_jwt_token] = override_verify_jwt_token
    yield
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def client(override_dependencies):
    with TestClient(app) as c:
        yield c
