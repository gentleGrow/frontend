from sqlalchemy import BigInteger
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
    async def update_assets(session: AsyncSession, assets: list[Asset]) -> bool:
        transaction_ids: list[BigInteger] = [asset.id for asset in assets]

        existing_asset_instance = await session.execute(select(Asset).filter(Asset.id.in_(transaction_ids)))
        existing_assets = existing_asset_instance.scalars().all()

        existing_asset_map = {existing_asset.id: existing_asset for existing_asset in existing_assets}

        for asset in assets:
            transaction = existing_asset_map.get(asset.id)
            if transaction is None:
                continue
            transaction.quantity = asset.quantity
            transaction.investment_bank = asset.investment_bank
            transaction.user_id = asset.user_id

        await session.commit()
        return True

    @staticmethod
    async def get_by_asset_type(session: AsyncSession, user_id: int, asset_type: AssetType) -> list[Asset]:
        result = await session.execute(select(Asset).filter(Asset.user_id == user_id, Asset.asset_type == asset_type))
        return result.scalars().all()

    @staticmethod
    async def get_eager(session: AsyncSession, user_id: int, asset_type: AssetType) -> list[Asset]:
        result = await session.execute(
            select(Asset)
            .filter(Asset.user_id == user_id, Asset.asset_type == asset_type)
            .options(joinedload(Asset.asset_stock).joinedload(AssetStock.stock))
        )
        return result.unique().scalars().all()
