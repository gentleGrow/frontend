from datetime import date
from app.module.auth.constant import DUMMY_USER_ID, DUMMY_NAME
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from app.module.asset.enum import AccountType, AssetType, InvestmentBankType, PurchaseCurrencyType
from app.module.asset.model import Asset, AssetStock, Dividend, Stock, StockDaily, Dividend
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from app.module.auth.enum import ProviderEnum, UserRoleEnum


@pytest.fixture(scope="function")
async def setup_realtime_stock_price(redis_client: Redis):
    keys = ["AAPL", "TSLA"]
    values = ["220.0", "230.0"]
    await redis_client.mset({key: value for key, value in zip(keys, values)})
    yield keys, values
    await redis_client.flushall()



@pytest.fixture(scope="function")
async def setup_exchange_rate(redis_client: Redis):
    keys = ["USD_KRW", "KRW_USD"]
    values = ["1300.0", "0.00075"]
    await redis_client.mset({key: value for key, value in zip(keys, values)})
    yield keys, values
    await redis_client.flushall()


@pytest.fixture(scope="function")
async def setup_dividend(db_session: AsyncSession, setup_stock):
    dividend1 = Dividend(
        dividend=1.5,  
        stock_code="AAPL",
        date=date(2024, 8, 13)
    )
    
    dividend2 = Dividend(
        dividend=1.6,  
        stock_code="AAPL",
        date=date(2024, 8, 14)
    )
    
    dividend3 = Dividend(
        dividend=0.8,  
        stock_code="TSLA",
        date=date(2024, 8, 13)
    )
    
    dividend4 = Dividend(
        dividend=0.9,  
        stock_code="TSLA",
        date=date(2024, 8, 14)
    )

    db_session.add_all([dividend1, dividend2, dividend3, dividend4])
    await db_session.commit()


@pytest.fixture(scope="function")
async def setup_user(db_session:AsyncSession):
    user = User(id=DUMMY_USER_ID, social_id='test_social_id', provider=ProviderEnum.GOOGLE, role=UserRoleEnum.USER, nickname=DUMMY_NAME)
    db_session.add(user)
    await db_session.commit()


@pytest.fixture(scope="function")
async def setup_stock(db_session:AsyncSession):
    stock_1 = Stock(id=1, code="AAPL", country="USA", market_index="NASDAQ", name="Apple Inc.")
    stock_2 = Stock(id=2, code="TSLA", country="USA", market_index="NASDAQ", name="Tesla Inc.")
    db_session.add_all([stock_1, stock_2])
    await db_session.commit()


@pytest.fixture(scope="function")
async def setup_stock_daily(db_session: AsyncSession, setup_stock):
    stock_daily_1 = StockDaily(
        adj_close_price=150.0,
        close_price=148.0,
        code="AAPL",
        date=date(2024, 8, 13),
        highest_price=152.0,
        lowest_price=147.0,
        opening_price=149.0,
        trade_volume=1000000
    )
    
    stock_daily_2 = StockDaily(
        adj_close_price=151.0,
        close_price=149.0,
        code="AAPL",
        date=date(2024, 8, 14),
        highest_price=153.0,
        lowest_price=148.0,
        opening_price=150.0,
        trade_volume=1050000
    )
    
    stock_daily_3 = StockDaily(
        adj_close_price=720.0,
        close_price=715.0,
        code="TSLA",
        date=date(2024, 8, 13),
        highest_price=730.0,
        lowest_price=710.0,
        opening_price=720.0,
        trade_volume=1500000
    )
    
    stock_daily_4 = StockDaily(
        adj_close_price=725.0,
        close_price=720.0,
        code="TSLA",
        date=date(2024, 8, 14),
        highest_price=735.0,
        lowest_price=715.0,
        opening_price=725.0,
        trade_volume=1600000
    )
    
    db_session.add_all([stock_daily_1, stock_daily_2, stock_daily_3, stock_daily_4])
    await db_session.commit()


@pytest.fixture(scope="function")
async def setup_asset(db_session:AsyncSession, setup_user, setup_stock):
    asset_stock1 = AssetStock(
        account_type=AccountType.ISA.value,
        investment_bank=InvestmentBankType.MIRAEASSET.value,
        purchase_currency_type=PurchaseCurrencyType.USA.value,
        purchase_date=date(2024, 8, 13),
        purchase_price=500.0,
        quantity=1,
        stock_id=1,
    )
    
    asset_stock2 = AssetStock(
        account_type=AccountType.PENSION.value,
        investment_bank=InvestmentBankType.TOSS.value,
        purchase_currency_type=PurchaseCurrencyType.KOREA.value,
        purchase_date=date(2024, 8, 14),
        purchase_price=1000.0,
        quantity=2,
        stock_id=2,
    )
    

    asset1 = Asset(asset_type=AssetType.STOCK.value, user_id=DUMMY_USER_ID, asset_stock=asset_stock1)
    asset2 = Asset(asset_type=AssetType.STOCK.value, user_id=DUMMY_USER_ID, asset_stock=asset_stock2)
    db_session.add_all([asset1, asset2])
    await db_session.commit()


@pytest.fixture(scope="function")
def transaction_data_success():
    return [
        {
            "account_type": "ISA",
            "buy_date": "2023-08-22",
            "investment_bank": "MIRAEASSET",
            "purchase_price": 2750.0,
            "purchase_currency_type": "USD",
            "quantity": 10,
            "stock_code": "AAPL",
        }
    ]


@pytest.fixture(scope="function")
def transaction_data_with_invalid_id():
    return [
        {
            "id": 1234,
            "account_type": "ISA",
            "buy_date": "2023-08-22",
            "investment_bank": "MIRAEASSET",
            "purchase_price": 2750.0,
            "purchase_currency_type": "USD",
            "quantity": 10,
            "stock_code": "AAPL",
        }
    ]


@pytest.fixture(scope="function")
def transaction_data_with_wrong_stock_code():
    return [
        {
            "account_type": "ISA",
            "buy_date": "2023-08-22",
            "investment_bank": "MIRAEASSET",
            "purchase_price": 2750.0,
            "purchase_currency_type": "USD",
            "quantity": 10,
            "stock_code": "UNKNOWN_CODE",
        }
    ]


@pytest.fixture(scope="function")
def exchange_rate():
    return {"USD_KRW": 1200.0, "KRW_USD": 0.00083}


@pytest.fixture(scope="function")
def mock_source_to_target_exchange_rate():
    return [
        1330.0,  # USD to KRW
        9.5,  # JPY to KRW
        850.0,  # AUD to KRW
        255.0,  # BRL to KRW
        950.0,  # CAD to KRW
        180.0,  # CNY to KRW
        1500.0,  # EUR to KRW
        170.0,  # HKD to KRW
        16.0,  # INR to KRW
        1450.0,  # CHF to KRW
        1600.0,  # GBP to KRW
        0.00075,  # KRW to USD
        0.007,  # JPY to USD
        0.65,  # AUD to USD
        0.19,  # BRL to USD
        0.75,  # CAD to USD
        0.14,  # CNY to USD
        1.1,  # EUR to USD
        0.13,  # HKD to USD
        0.012,  # INR to USD
        1.1,  # CHF to USD
        1.3,  # GBP to USD
    ]


@pytest.fixture(scope="function")
def current_stock_price_map() -> dict[str, float]:
    return {"AAPL": 155.0, "GOOGL": 2800.0}


@pytest.fixture(scope="function")
def stock_dailies() -> list[StockDaily]:
    return [
        StockDaily(
            code="AAPL",
            date=date(2023, 6, 28),
            adj_close_price=150.0,
            opening_price=145.0,
            highest_price=155.0,
            lowest_price=143.0,
            trade_volume=10000,
        ),
        StockDaily(
            code="GOOGL",
            date=date(2023, 6, 28),
            adj_close_price=2800.0,
            opening_price=2750.0,
            highest_price=2850.0,
            lowest_price=2730.0,
            trade_volume=5000,
        ),
        StockDaily(
            code="AAPL",
            date=date(2023, 6, 29),
            adj_close_price=155.0,
            opening_price=150.0,
            highest_price=157.0,
            lowest_price=148.0,
            trade_volume=12000,
        ),
    ]


@pytest.fixture(scope="function")
def dividends() -> list[Dividend]:
    return [Dividend(stock_code="AAPL", dividend=0.5), Dividend(stock_code="GOOGL", dividend=0.8)]


@pytest.fixture(scope="function")
def dummy_assets() -> list[Asset]:
    return [
        Asset(
            asset_type="STOCK",
            user_id="test_user",
            asset_stock=AssetStock(
                account_type=AccountType.ISA.value,
                investment_bank=InvestmentBankType.TOSS.value,
                purchase_currency_type=PurchaseCurrencyType.KOREA.value,
                purchase_date=date(2023, 6, 28),
                purchase_price=145.0,
                quantity=10,
                stock=Stock(code="AAPL", country="USA", name="Apple Inc."),
            ),
        ),
        Asset(
            asset_type="STOCK",
            user_id="test_user",
            asset_stock=AssetStock(
                account_type=AccountType.REGULAR.value,
                investment_bank=InvestmentBankType.MIRAEASSET.value,
                purchase_currency_type=PurchaseCurrencyType.USA,
                purchase_date=date(2023, 6, 28),
                purchase_price=2750.0,
                quantity=5,
                stock=Stock(code="GOOGL", country="USA", name="Alphabet Inc."),
            ),
        ),
    ]


@pytest.fixture(scope="function")
def current_stock_daily_map(stock_dailies) -> dict[tuple[str, date], StockDaily]:
    return {(daily.code, daily.date): daily for daily in stock_dailies}
