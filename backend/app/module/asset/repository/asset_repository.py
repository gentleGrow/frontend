from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

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
    async def update_assets(db: AsyncSession, asset_transactions: list[Asset]) -> bool:
        transaction_ids: list[Asset.id] = [asset_transaction.id for asset_transaction in asset_transactions]

        existing_transactions = await db.execute(select(Asset).filter(Asset.id.in_(transaction_ids)))
        existing_transactions = existing_transactions.scalars().all()

        transaction_map = {transaction.id: transaction for transaction in existing_transactions}

        for asset_transaction in asset_transactions:
            transaction = transaction_map.get(asset_transaction.id)
            if transaction is None:
                continue
            transaction.quantity = asset_transaction.quantity
            transaction.investment_bank = asset_transaction.investment_bank
            transaction.user_id = asset_transaction.user_id

        await db.commit()
        return True

    @staticmethod
    async def get_stock_assets_by_user_id(db: AsyncSession, user_id: str) -> list[Asset]:
        result = await db.execute(
            select(Asset)
            .options(joinedload(Asset.user))
            .filter(Asset.user_id == user_id, Asset.type == AssetType.STOCK)
        )
        return result.scalars().all()
