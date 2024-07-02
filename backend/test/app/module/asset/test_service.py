from app.module.asset.enum import CurrencyType
from app.module.asset.schema.stock_schema import StockAssetResponse
from app.module.asset.service import (
    check_not_found_stock,
    format_asset_response,
    get_exchange_rate,
    get_stock_mapping_info,
)
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.


def test_get_exchange_rate(exchange_rates):
    rate = get_exchange_rate(exchange_rates, CurrencyType.USA, CurrencyType.KOREA)
    assert rate == 1100

    rate = get_exchange_rate(exchange_rates, CurrencyType.KOREA, CurrencyType.USA)
    assert rate == 0.0009

    rate = get_exchange_rate(exchange_rates, CurrencyType.USA, CurrencyType.USA)
    assert rate == 1.0


def test_get_stock_mapping_info(stock_dailies, dividends):
    stock_daily_map, dividend_map, current_stock_daily_map = get_stock_mapping_info(stock_dailies, dividends)

    assert len(stock_daily_map) == len(stock_dailies)
    assert len(dividend_map) == len(dividends)
    assert current_stock_daily_map["AAPL"].adj_close_price == 155.0
    assert current_stock_daily_map["GOOGL"].adj_close_price == 2800.0


def test_check_not_found_stock(stock_dailies, dividends, dummy_assets):
    stock_daily_map, dividend_map, current_stock_daily_map = get_stock_mapping_info(stock_dailies, dividends)
    not_found_stock_codes = check_not_found_stock(stock_daily_map, current_stock_daily_map, dummy_assets)

    assert len(not_found_stock_codes) == 0


def test_format_asset_response(stock_dailies, dividends, exchange_rates, dummy_assets):
    stock_daily_map, dividend_map, current_stock_daily_map = get_stock_mapping_info(stock_dailies, dividends)
    response = format_asset_response(
        dummy_assets, stock_daily_map, current_stock_daily_map, dividend_map, exchange_rates, True
    )

    assert isinstance(response, StockAssetResponse)
    assert len(response.stock_assets) == len(dummy_assets)
    assert response.total_asset_amount > 0
    assert response.total_invest_amount > 0
    assert response.total_dividend_amount > 0
