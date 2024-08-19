from unittest.mock import patch

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from database.config import MySQLBase

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
    with patch("database.redis.RedisRealTimeStockRepository.bulk_get", return_value=[]), patch(
        "database.redis.RedisRealTimeStockRepository.save", return_value=None
    ), patch("database.redis.RedisExchangeRateRepository.bulk_get", return_value=[]), patch(
        "database.redis.RedisExchangeRateRepository.save", return_value=None
    ), patch(
        "database.redis.RedisDummyAssetRepository.get", return_value=None
    ), patch(
        "database.redis.RedisDummyAssetRepository.save", return_value=None
    ), patch(
        "database.redis.RedisSessionRepository.get", return_value=None
    ), patch(
        "database.redis.RedisSessionRepository.save", return_value=None
    ):
        yield
