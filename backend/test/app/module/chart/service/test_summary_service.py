from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from freezegun import freeze_time
from app.module.asset.model import Asset, StockDaily
from app.module.chart.service.summary_service import SummaryService
from app.module.asset.services.asset_stock_service import AssetStockService
from app.module.asset.services.stock_daily_service import StockDailyService
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.asset.services.stock_service import StockService
from app.module.auth.constant import DUMMY_USER_ID
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.enum import AssetType
from redis.asyncio import Redis
from icecream import ic

class TestSummaryService:
    @freeze_time("2024-10-01")
    async def test_get_today_review_rate_assets_older_than_30_days(
        self,
        setup_all,
        redis_client: Redis,
        session: AsyncSession
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
        latest_stock_daily_map: dict[str, StockDaily] = await StockDailyService.get_latest_map(session, assets)
        current_stock_price_map: dict[str, float] = await StockService.get_current_stock_price_by_code(
            redis_client, latest_stock_daily_map, [asset.asset_stock.stock.code for asset in assets]
        )
        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)
        total_asset_amount = AssetStockService.get_total_asset_amount(
            assets, current_stock_price_map, exchange_rate_map
        )

        assets_30days = [asset for asset in assets if asset.asset_stock.purchase_date <= datetime.now().date() - timedelta(days=30)]
        
        # When
        result = SummaryService.get_today_review_rate(
            assets=assets,
            total_asset_amount=total_asset_amount,
            current_stock_price_map=current_stock_price_map,
            exchange_rate_map=exchange_rate_map
        )

        ic(assets)
        ic(latest_stock_daily_map)
        ic(current_stock_price_map)
        ic(exchange_rate_map)
        ic(total_asset_amount)
        ic(assets_30days)
        
        # Then
        assert len(assets_30days) > 0
        total_asset_amount_30days = AssetStockService.get_total_asset_amount(
            assets_30days, current_stock_price_map, exchange_rate_map
        )
        expected_result = (total_asset_amount - total_asset_amount_30days) / total_asset_amount * 100 if total_asset_amount_30days > 0.0 else 0.0
        
        ic(expected_result)
        assert result == expected_result
    
    @freeze_time("2024-09-01")
    async def test_get_today_review_rate_no_assets_older_than_30_days(
        self,
        setup_all,
        redis_client: Redis,
        session: AsyncSession
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
        latest_stock_daily_map: dict[str, StockDaily] = await StockDailyService.get_latest_map(session, assets)
        current_stock_price_map: dict[str, float] = await StockService.get_current_stock_price_by_code(
            redis_client, latest_stock_daily_map, [asset.asset_stock.stock.code for asset in assets]
        )
        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)
        total_asset_amount = AssetStockService.get_total_asset_amount(
            assets, current_stock_price_map, exchange_rate_map
        )

        assets_30days = [asset for asset in assets if asset.asset_stock.purchase_date <= datetime.now().date() - timedelta(days=30)]
        
        # When
        result = SummaryService.get_today_review_rate(
            assets=assets,
            total_asset_amount=total_asset_amount,
            current_stock_price_map=current_stock_price_map,
            exchange_rate_map=exchange_rate_map
        )

        # Then
        assert len(assets_30days) == 0
        expected_result = 100.0
        assert result == expected_result
