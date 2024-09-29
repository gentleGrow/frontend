import json
from datetime import datetime
from app.module.asset.model import MarketIndexDaily, MarketIndexMinutely
import pytest
from redis.asyncio import Redis
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.schema import MarketIndexData
from app.data.investing.sources.enum import RicePeople
from app.module.chart.constant import INVESTMENT_TIP
from app.module.chart.repository import TipRepository
from app.module.asset.enum import Country, MarketIndex

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


@pytest.fixture(scope="function")
async def setup_market_index_daily(session: AsyncSession):
    market_index_1 = MarketIndexDaily(
        name=MarketIndex.KOSPI,
        date=date(2024, 8, 10),
        open_price=3000.0,
        close_price=3100.0,
        high_price=3200.0,
        low_price=2990.0,
        volume=1000000,
    )
    
    market_index_2 = MarketIndexDaily(
        name=MarketIndex.KOSPI,
        date=date(2024, 8, 11),
        open_price=3100.0,
        close_price=3150.0,
        high_price=3250.0,
        low_price=3080.0,
        volume=1200000,
    )

    session.add_all([market_index_1, market_index_2])
    await session.commit()

@pytest.fixture(scope="function")
async def setup_market_index_minutely(session: AsyncSession):
    market_index_1 = MarketIndexMinutely(
        name=MarketIndex.KOSPI,
        datetime=datetime(2024, 9, 24, 21, 30),
        current_price=3100.0,
    )
    
    market_index_2 = MarketIndexMinutely(
        name=MarketIndex.KOSPI,
        datetime=datetime(2024, 9, 24, 22, 30),
        current_price=3150.0,
    )
    
    session.add_all([market_index_1, market_index_2])
    await session.commit()


@pytest.fixture(scope="function")
async def setup_current_index(redis_client: Redis):
    kospi_index = MarketIndexData(
        country=Country.KOREA,
        name=MarketIndex.KOSPI,
        current_value="3200.0",
        change_value="50.0",
        change_percent="1.5",
        update_time="",
    )

    kospi_index_json = kospi_index.model_dump_json()
    
    await redis_client.set(MarketIndex.KOSPI, kospi_index_json)
    yield kospi_index_json
    await redis_client.flushall()

