from app.module.asset.schema.stock_schema import StockAssetResponse
from app.module.asset.service import check_not_found_stock, get_total_asset_data
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.


def test_get_stock_mapping_info(stock_dailies, dividends):
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    dividend_map = {dividend.stock_code: dividend for dividend in dividends}

    assert len(stock_daily_map) == len(stock_dailies)
    assert len(dividend_map) == len(dividends)


def test_check_not_found_stock(stock_dailies, dummy_assets, current_stock_price_map):
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    not_found_stock_codes = check_not_found_stock(stock_daily_map, current_stock_price_map, dummy_assets)

    assert len(not_found_stock_codes) == 0


async def test_format_asset_response(stock_dailies, dividends, dummy_assets, current_stock_daily_map):
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    dividend_map = {dividend.stock_code: dividend for dividend in dividends}

    (
        stock_assets,
        total_asset_amount,
        total_invest_amount,
        total_invest_growth_rate,
        total_dividend_amount,
    ) = get_total_asset_data(dummy_assets, stock_daily_map, current_stock_daily_map, dividend_map, True)

    response: StockAssetResponse = StockAssetResponse.parse(
        stock_assets, total_asset_amount, total_invest_amount, total_invest_growth_rate, total_dividend_amount
    )

    assert isinstance(response, StockAssetResponse)
    assert len(response.stock_assets) == len(dummy_assets)
    assert response.total_asset_amount > 0
    assert response.total_invest_amount > 0
    assert response.total_dividend_amount > 0
