from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AssetType
from app.module.asset.model import Asset
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.services.stock_daily_service import StockDailyService
from app.module.asset.services.stock_service import StockService
from app.module.auth.constant import DUMMY_USER_ID


class TestStockService:
    async def test_check_not_found_stock(self, db_session: AsyncSession, setup_asset, setup_stock_daily, setup_user):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(db_session, DUMMY_USER_ID, AssetType.STOCK)

        stock_daily_map = await StockDailyService.get_map_range(db_session, assets)
        lastest_stock_daily_map = await StockDailyService.get_latest_map(db_session, assets)

        current_stock_price_map = {stock_code: None for stock_code in lastest_stock_daily_map.keys()}

        # When
        not_found_stock_codes = StockService.check_not_found_stock(stock_daily_map, current_stock_price_map, assets)

        # Then
        expected_not_found_stock_codes = [asset.asset_stock.stock.code for asset in assets]
        assert not_found_stock_codes == expected_not_found_stock_codes

    async def test_get_current_stock_price(
        self,
        db_session: AsyncSession,
        redis_client: Redis,
        setup_user,
        setup_stock_daily,
        setup_realtime_stock_price,
        setup_asset,
    ):
        # Given
        assets = await AssetRepository.get_eager(db_session, DUMMY_USER_ID, AssetType.STOCK)
        lastest_stock_daily_map = await StockDailyService.get_latest_map(db_session, assets)

        expected_keys, expected_values = setup_realtime_stock_price
        current_prices = await StockService.get_current_stock_price(redis_client, lastest_stock_daily_map, assets)

        # Then
        for stock_code, expected_value in zip(expected_keys, expected_values):
            assert current_prices[stock_code] == float(expected_value)

        for asset in assets:
            stock_code = asset.asset_stock.stock.code
            assert stock_code in current_prices

        for stock_code, stock_daily in lastest_stock_daily_map.items():
            if stock_code not in expected_keys:
                assert current_prices[stock_code] == stock_daily.adj_close_price
