from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from app.module.asset.enum import AssetType
from app.module.asset.model import Asset, AssetStock


class AssetRepository:
    @staticmethod
    async def get_assets(session: AsyncSession, user_id: str) -> list[Asset]:
        result = await session.execute(select(Asset).filter(Asset.user_id == user_id))
        return result.scalars().all()

    @staticmethod
    async def save_assets(session: AsyncSession, assets: list[Asset]) -> None:
        session.add_all(assets)
        await session.commit()

    @staticmethod
    async def get_eager(session: AsyncSession, user_id: int, asset_type: AssetType) -> list[Asset]:
        result = await session.execute(
            select(Asset)
            .filter(Asset.user_id == user_id, Asset.asset_type == asset_type)
            .options(joinedload(Asset.asset_stock).joinedload(AssetStock.stock))
        )
        return result.unique().scalars().all()

    @staticmethod
    async def get_assets_by_ids(session: AsyncSession, asset_ids: list[int]) -> list[Asset]:
        result = await session.execute(
            select(Asset)
            .filter(Asset.id.in_(asset_ids))
            .options(joinedload(Asset.asset_stock).joinedload(AssetStock.stock))
        )
        return result.scalars().all()
