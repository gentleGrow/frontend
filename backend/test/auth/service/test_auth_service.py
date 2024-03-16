from os import getenv
from unittest.mock import AsyncMock, patch

import pytest
from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from starlette.requests import Request

from api.v1.auth.database.models import User
from api.v1.auth.database.schemas import ProviderEnum
from api.v1.auth.service.auth_service import AuthenticationBuilder
from database.config import PostgresBase

load_dotenv()
TEST_POSTGRESSQL_URL = getenv("TEST_POSTGRESSQL_URL", None)

engine = create_engine(TEST_POSTGRESSQL_URL)
TestingSessionLocal = sessionmaker(autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    PostgresBase.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()


@pytest.mark.asyncio
@patch(
    "api.v1.auth.service.auth_service.authenticate_with_google", new_callable=AsyncMock
)
async def test_google_authenticate_success(mock_authenticate_with_google, db_session):
    mock_authenticate_with_google.return_value = "12345"

    auth_builder = AuthenticationBuilder()
    request = Request(scope={"type": "http"})

    user = await auth_builder.google_authenticate(db_session, request)

    assert user.social_id == "12345"
    assert user.provider == ProviderEnum.google
    db_user = (
        db_session.query(User)
        .filter_by(social_id="12345", provider=ProviderEnum.google)
        .first()
    )
    assert db_user is not None


@pytest.mark.asyncio
@patch(
    "api.v1.auth.service.auth_service.authenticate_with_google", new_callable=AsyncMock
)
async def test_google_authenticate_failure(mock_authenticate_with_google, db_session):
    mock_authenticate_with_google.side_effect = HTTPException(
        status_code=400, detail="OAuth error"
    )

    auth_builder = AuthenticationBuilder()
    request = Request(scope={"type": "http"})

    with pytest.raises(HTTPException) as exc_info:
        await auth_builder.google_authenticate(db_session, request)

    assert exc_info.value.status_code == 400
    assert "OAuth error" in str(exc_info.value.detail)
