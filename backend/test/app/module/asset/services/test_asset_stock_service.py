import pytest
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AssetType, PurchaseCurrencyType
from app.module.asset.model import Asset
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.services.asset_stock_service import AssetStockService
from app.module.asset.services.dividend_service import DividendService
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.asset.services.stock_daily_service import StockDailyService
from app.module.asset.services.stock_service import StockService
from app.module.auth.constant import DUMMY_USER_ID


class TestAssetStockService:
    async def test_get_total_investment_amount(
        self, db_session: AsyncSession, redis_client: Redis, setup_asset, setup_exchange_rate, setup_stock_daily
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(db_session, DUMMY_USER_ID, AssetType.STOCK)
        exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)
        stock_daily_map = await StockDailyService.get_map_range(db_session, assets)

        # When
        total_investment_amount = AssetStockService.get_total_investment_amount(
            assets=assets,
            stock_daily_map=stock_daily_map,
            exchange_rate_map=exchange_rate_map,
        )

        # Then
        expected_total_investment_amount = 0.0
        for asset in assets:
            stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date), None)
            if stock_daily is None:
                continue

            if asset.asset_stock.purchase_currency_type == PurchaseCurrencyType.USA:
                invest_price = (
                    asset.asset_stock.purchase_price
                    * ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
                    if asset.asset_stock.purchase_price
                    else stock_daily.adj_close_price
                    * ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
                )
            else:
                invest_price = (
                    asset.asset_stock.purchase_price
                    if asset.asset_stock.purchase_price
                    else stock_daily.adj_close_price
                )

            expected_total_investment_amount += invest_price * asset.asset_stock.quantity

        assert total_investment_amount == pytest.approx(expected_total_investment_amount)

    async def test_get_total_asset_amount(
        self,
        db_session: AsyncSession,
        redis_client: Redis,
        setup_asset,
        setup_realtime_stock_price,
        setup_exchange_rate,
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(db_session, DUMMY_USER_ID, AssetType.STOCK)
        lastest_stock_daily_map = await StockDailyService.get_latest_map(db_session, assets)
        current_stock_price_map = await StockService.get_current_stock_price(
            redis_client, lastest_stock_daily_map, assets
        )
        exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

        # When
        total_asset_amount = AssetStockService.get_total_asset_amount(
            assets=assets,
            current_stock_price_map=current_stock_price_map,
            exchange_rate_map=exchange_rate_map,
        )

        # Then
        expected_total_asset_amount = 0.0
        for asset in assets:
            current_price = current_stock_price_map.get(asset.asset_stock.stock.code)
            exchange_rate = ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
            expected_total_asset_amount += current_price * asset.asset_stock.quantity * exchange_rate

        assert total_asset_amount == pytest.approx(expected_total_asset_amount)

    async def test_get_stock_assets(
        self,
        db_session: AsyncSession,
        redis_client: Redis,
        setup_asset,
        setup_dividend,
        setup_exchange_rate,
        setup_realtime_stock_price,
        setup_stock,
        setup_stock_daily,
        setup_user,
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(db_session, DUMMY_USER_ID, AssetType.STOCK)
        stock_daily_map = await StockDailyService.get_map_range(db_session, assets)
        lastest_stock_daily_map = await StockDailyService.get_latest_map(db_session, assets)
        dividend_map = await DividendService.get_recent_map(db_session, assets)
        exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)
        current_stock_price_map = await StockService.get_current_stock_price(
            redis_client, lastest_stock_daily_map, assets
        )

        # When
        stock_assets = AssetStockService.get_stock_assets(
            assets=assets,
            stock_daily_map=stock_daily_map,
            current_stock_price_map=current_stock_price_map,
            dividend_map=dividend_map,
            exchange_rate_map=exchange_rate_map,
        )

        # Then
        expected_exchange_rate_aapl: float = (
            ExchangeRateService.get_dollar_exchange_rate(assets[0], exchange_rate_map)
            if assets[0].asset_stock.purchase_currency_type == PurchaseCurrencyType.USA
            else ExchangeRateService.get_won_exchange_rate(assets[0], exchange_rate_map)
        )
        stock_asset_aapl = next(asset for asset in stock_assets if asset.stock_code == "AAPL")
        assert stock_asset_aapl.stock_name == "Apple Inc."
        assert stock_asset_aapl.current_price == 220.0 * expected_exchange_rate_aapl
        assert stock_asset_aapl.dividend == 1.6 * stock_asset_aapl.quantity * expected_exchange_rate_aapl
        assert stock_asset_aapl.profit_rate == pytest.approx(
            ((220.0 * expected_exchange_rate_aapl - 500.0) / 500.0) * 100
        )
        assert stock_asset_aapl.purchase_price == 500.0

        stock_asset_tsla = next(asset for asset in stock_assets if asset.stock_code == "TSLA")
        expected_exchange_rate_tsla: float = (
            ExchangeRateService.get_dollar_exchange_rate(assets[1], exchange_rate_map)
            if assets[1].asset_stock.purchase_currency_type == PurchaseCurrencyType.USA
            else ExchangeRateService.get_won_exchange_rate(assets[1], exchange_rate_map)
        )
        assert stock_asset_tsla.stock_name == "Tesla Inc."
        assert stock_asset_tsla.current_price == 230.0 * expected_exchange_rate_tsla
        assert stock_asset_tsla.dividend == 0.9 * stock_asset_tsla.quantity * expected_exchange_rate_tsla

        stock_asset_samsung = next(asset for asset in stock_assets if asset.stock_code == "005930")
        assert stock_asset_samsung.stock_name == "삼성전자"
        assert stock_asset_samsung.current_price == 70000.0
        assert stock_asset_samsung.dividend == 105.0
