from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import AssetStock


class AssetStockRepository:
    @staticmethod
    async def get_asset_stock(session: AsyncSession, asset_id: int) -> AssetStock:
        stmt = select(AssetStock).where(AssetStock.asset_id == asset_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
