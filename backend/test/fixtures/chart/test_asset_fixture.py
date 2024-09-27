import json

import pytest
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.investing.sources.enum import RicePeople
from app.module.chart.constant import INVESTMENT_TIP
from app.module.chart.repository import TipRepository


@pytest.fixture(scope="function")
async def setup_tip(session: AsyncSession):
    await TipRepository.save_invest_tips(session, INVESTMENT_TIP)


@pytest.fixture
async def setup_rich_portfolio(redis_client: Redis):
    rich_people = [person.value for person in RicePeople]
    rich_portfolio = [
        {"AAPL": "30.1%", "BAC": "14.7%"},
        {"HHC": "18.2%", "QSR": "15.4%"},
        {"TSLA": "23.1%", "DAL": "12.3%"},
        {"MSFT": "10.2%", "FB": "9.8%"},
        {"AAPL": "16.5%", "GOOGL": "14.8%"},
        {"SPY": "24.3%", "GLD": "17.6%"},
        {"V": "22.1%", "PEP": "18.7%"},
    ]

    await redis_client.mset({rich: json.dumps(portfolio) for rich, portfolio in zip(rich_people, rich_portfolio)})
    yield rich_portfolio
    await redis_client.flushall()
