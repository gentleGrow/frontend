from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.services.dividend_service import DividendService
from sqlalchemy.future import select
from app.module.auth.constant import DUMMY_USER_ID
from app.module.asset.model import Asset


class TestDividendService:
    async def test_get_recent_map(
        self,
        db_session: AsyncSession,
        setup_dividend,
        setup_asset
    ):
        # Given
        assets = await db_session.execute(select(Asset).filter(Asset.user_id == DUMMY_USER_ID))
        assets = assets.scalars().all()

        # When
        result = await DividendService.get_recent_map(db_session, assets)

        # Then
        assert len(result) == 2  
        assert result["AAPL"] == 1.60 
        assert result["TSLA"] == 0.90 
