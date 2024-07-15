import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from database.config import MySQLBase
from database.dependency import get_redis_pool

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


@pytest.fixture(scope="session")
async def redis_client():
    client = get_redis_pool()
    yield client
    await client.close()
