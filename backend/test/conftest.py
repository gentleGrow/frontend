from datetime import datetime, timezone
from unittest.mock import AsyncMock, create_autospec

import pytest
from sqlalchemy.orm import Session

from app.common.auth.jwt import JWTBuilder
from app.modules.auth.handlers import Google
from app.modules.auth.repository import UserRepository


@pytest.fixture
def user_repository():
    return UserRepository()


@pytest.fixture
def google_auth(user_repository, jwt_builder):
    return Google(user_repository, jwt_builder)


@pytest.fixture(autouse=True)
def setup_env(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "your_secret_key")
    monkeypatch.setenv("JWT_ALGORITHM", "HS256")
    monkeypatch.setenv("JWT_ACCESS_TIME", "30")
    monkeypatch.setenv("JWT_REFRESH_TIME", "300")


@pytest.fixture
def jwt_builder(setup_env):
    return JWTBuilder()


@pytest.fixture
def mock_jwt_datetime(monkeypatch):
    class MockDateTime:
        @classmethod
        def now(cls, tz=None):
            return datetime(2022, 1, 1, tzinfo=timezone.utc)

    monkeypatch.setattr("app.common.auth.jwt.datetime", MockDateTime)


@pytest.fixture
def mock_redis():
    mock = AsyncMock()
    return mock


@pytest.fixture
def mock_session():
    return create_autospec(Session, instance=True)
