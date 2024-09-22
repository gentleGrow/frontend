from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.model import Asset
from datetime import date
from app.module.asset.services.stock_daily_service import StockDailyService
from sqlalchemy.future import select
from app.module.auth.constant import DUMMY_USER_ID


class TestStockDailyService:
    async def test_get_latest_map(
        self,
        db_session: AsyncSession,
        setup_stock_daily, 
        setup_asset
    ):
        # Given
        assets = await db_session.execute(select(Asset).filter(Asset.user_id == DUMMY_USER_ID))
        assets = assets.scalars().all()

        # When
        result = await StockDailyService.get_latest_map(db_session, assets)

        # Then
        assert len(result) == 2

        assert "AAPL" in result
        latest_aapl = result["AAPL"]
        assert latest_aapl.code == "AAPL"
        assert latest_aapl.date == date(2024, 8, 14) 

        assert "TSLA" in result
        latest_tsla = result["TSLA"]
        assert latest_tsla.code == "TSLA"
        assert latest_tsla.date == date(2024, 8, 14)
    
    async def test_get_map_range(
        self,
        db_session: AsyncSession,
        setup_stock_daily, 
        setup_asset
    ):
        # Given
        assets = await db_session.execute(select(Asset).filter(Asset.user_id == DUMMY_USER_ID))
        assets = assets.scalars().all()
        
        # When
        result = await StockDailyService.get_map_range(db_session, assets)

        # Then
        assert len(result) == 2 

        assert ("AAPL", date(2024, 8, 13)) in result
        stock_daily_aapl = result[("AAPL", date(2024, 8, 13))]
        assert stock_daily_aapl.code == "AAPL"
        assert stock_daily_aapl.date == date(2024, 8, 13)

        assert ("TSLA", date(2024, 8, 14)) in result
        stock_daily_tsla = result[("TSLA", date(2024, 8, 14))]
        assert stock_daily_tsla.code == "TSLA"
        assert stock_daily_tsla.date == date(2024, 8, 14)

    