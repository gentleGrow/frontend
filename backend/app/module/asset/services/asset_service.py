from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import Asset
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.schema import AssetStockPutRequest


class AssetService:
    @staticmethod
    async def get_asset_map(session: AsyncSession, asset_id: int) -> dict[int, Asset] | None:
        asset = await AssetRepository.get_asset_by_id(session, asset_id)
        return {asset.id: asset} if asset else None

    @staticmethod
    async def save_asset_by_put(
        session: AsyncSession, request_data: AssetStockPutRequest, asset: Asset, stock_id: int
    ) -> None:
        if request_data.account_type is not None:
            asset.asset_stock.account_type = request_data.account_type

        if request_data.investment_bank is not None:
            asset.asset_stock.investment_bank = request_data.investment_bank

        if request_data.purchase_currency_type is not None:
            asset.asset_stock.purchase_currency_type = request_data.purchase_currency_type

        if request_data.buy_date is not None:
            asset.asset_stock.purchase_date = request_data.buy_date

        if request_data.purchase_price is not None:
            asset.asset_stock.purchase_price = request_data.purchase_price

        if request_data.quantity is not None:
            asset.asset_stock.quantity = request_data.quantity

        asset.asset_stock.stock_id = stock_id

        await AssetRepository.save(session, asset)
