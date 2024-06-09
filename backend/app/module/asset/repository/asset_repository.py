from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.module.asset.enum import AssetType
from app.module.asset.model import Asset


class AssetRepository:
    @staticmethod
    async def get_assets(db: AsyncSession, user_id: str) -> list[Asset]:
        result = await db.execute(select(Asset).filter(Asset.user_id == user_id))
        return result.scalars().all()

    @staticmethod
    async def save_assets(db: AsyncSession, asset_transactions: list[Asset]) -> bool:
        transactions: list[Asset] = [
            Asset(
                quantity=asset_transaction.quantity,
                investment_bank=asset_transaction.investment_bank,
                user_id=asset_transaction.user_id,
            )
            for asset_transaction in asset_transactions
        ]
        db.add_all(transactions)
        await db.commit()
        return True

    @staticmethod
    async def update_assets(db: AsyncSession, assets: list[Asset]) -> bool:
        transaction_ids: list[Asset.id] = [asset.id for asset in assets]

        existing_asset_instance = await db.execute(select(Asset).filter(Asset.id.in_(transaction_ids)))
        existing_assets = existing_asset_instance.scalars().all()

        existing_asset_map = {existing_asset.id: existing_asset for existing_asset in existing_assets}

        for asset in assets:
            transaction = existing_asset_map.get(asset.id)
            if transaction is None:
                continue
            transaction.quantity = asset.quantity
            transaction.investment_bank = asset.investment_bank
            transaction.user_id = asset.user_id

        await db.commit()
        return True

    @staticmethod
    async def get_asset_stock(db: AsyncSession, user_id: int) -> list[Asset]:
        result = await db.execute(
            select(Asset)
            .options(selectinload(Asset.stock))
            .filter(Asset.user_id == user_id, Asset.asset_type == AssetType.STOCK)
        )
        return result.scalars().all()

    @staticmethod
    async def save_asset_stock(db: AsyncSession, assets: list[Asset]) -> None:
        db.add_all(assets)
        await db.commit()
