import pytest
from app.module.asset.schema import StockAssetResponse
from app.module.asset.model import Asset
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.auth.constant import DUMMY_USER_ID
from app.module.asset.enum import AssetType


class TestStockAssetResponse:
    @pytest.mark.asyncio
    async def test_validate_assets_empty(
        self,
        setup_asset
    ):
        # Given
        empty_assets: list[Asset] = []

        # When
        response = StockAssetResponse.validate_assets(empty_assets)

        # Then
        expected_response = StockAssetResponse(
            stock_assets=[],
            total_asset_amount=0.0,
            total_invest_amount=0.0,
            total_profit_rate=0.0,
            total_profit_amount=0.0,
            total_dividend_amount=0.0,
        )

        assert response == expected_response

    @pytest.mark.asyncio
    async def test_validate_assets_non_empty(
        self,
        db_session,
        setup_asset
    ):
        # Given
        non_empty_assets: list[Asset] = await AssetRepository.get_eager(db_session, DUMMY_USER_ID, AssetType.STOCK)

        # When
        response = StockAssetResponse.validate_assets(non_empty_assets)

        # Then
        assert response is None
