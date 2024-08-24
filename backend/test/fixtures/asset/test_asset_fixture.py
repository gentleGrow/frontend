from datetime import date

import pytest

from app.module.asset.enum import AccountType, InvestmentBankType, PurchaseCurrencyType
from app.module.asset.model import Asset, AssetStock, Dividend, Stock, StockDaily
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.


@pytest.fixture(scope="module")
def exchange_rate():
    return {"USD_KRW": 1200.0, "KRW_USD": 0.00083}


@pytest.fixture(scope="module")
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


@pytest.fixture(scope="module")
def current_stock_price_map() -> dict[str, float]:
    return {"AAPL": 155.0, "GOOGL": 2800.0}


@pytest.fixture(scope="module")
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


@pytest.fixture(scope="module")
def dividends() -> list[Dividend]:
    return [Dividend(stock_code="AAPL", dividend=0.5), Dividend(stock_code="GOOGL", dividend=0.8)]


@pytest.fixture(scope="module")
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


@pytest.fixture(scope="module")
def current_stock_daily_map(stock_dailies) -> dict[tuple[str, date], StockDaily]:
    return {(daily.code, daily.date): daily for daily in stock_dailies}
