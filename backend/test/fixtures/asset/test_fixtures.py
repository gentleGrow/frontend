import pytest

from app.module.asset.model import Asset, AssetStock, Dividend, Stock, StockDaily
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.


@pytest.fixture(scope="module")
def stock_dailies() -> list[StockDaily]:
    return [
        StockDaily(
            code="AAPL",
            date="2023-06-28",
            adj_close_price=150.0,
            opening_price=145.0,
            highest_price=155.0,
            lowest_price=143.0,
            trade_volume=10000,
        ),
        StockDaily(
            code="GOOGL",
            date="2023-06-28",
            adj_close_price=2800.0,
            opening_price=2750.0,
            highest_price=2850.0,
            lowest_price=2730.0,
            trade_volume=5000,
        ),
        StockDaily(
            code="AAPL",
            date="2023-06-29",
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
            asset_stock=AssetStock(stock=Stock(code="AAPL", country="usa", name="Apple Inc."), purchase_price=145.0),
            user_id="test_user",
            quantity=10,
            investment_bank="TOSS",
            account_type="REGULAR",
            asset_type="STOCK",
            purchase_date="2023-06-28",
        ),
        Asset(
            asset_stock=AssetStock(
                stock=Stock(code="GOOGL", country="usa", name="Alphabet Inc."), purchase_price=2750.0
            ),
            user_id="test_user",
            quantity=5,
            investment_bank="TOSS",
            account_type="REGULAR",
            asset_type="STOCK",
            purchase_date="2023-06-28",
        ),
    ]
