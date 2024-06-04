from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.common.repository.base_repository import AbstractCRUDRepository
from app.modules.asset.model import Asset
from data.common.schemas import StockList, StockPriceList


class RedisStockRepository(AbstractCRUDRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def save(self, stock_code_chunk: StockList, price_list: StockPriceList, expiry: int) -> None:
        async with self.redis.pipeline() as pipe:
            for code, price in [
                (stock.code, price.price) for stock, price in zip(stock_code_chunk.stocks, price_list.prices)
            ]:
                pipe.set(code, price, ex=expiry)
            await pipe.execute()

    async def get(self, stock_code: str) -> int:
        return await self.redis.get(stock_code)


class AssetRepository:
    @staticmethod
    async def get_assets(db: AsyncSession, user_id: str) -> list[Asset]:
        result = await db.execute(select(Asset).filter(Asset.user_id == user_id))
        return result.scalars().all()

    @staticmethod
    async def save_assets(db: AsyncSession, asset_transactions: list[Asset]) -> bool:
        transactions: list[Asset] = [
            Asset(
                id=Asset.get_uuid(),
                quantity=asset_transaction.quantity,
                investment_bank=asset_transaction.investment_bank,
                stock_id=asset_transaction.stock_id,
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
            transaction.stock_id = asset_transaction.stock_id
            transaction.user_id = asset_transaction.user_id

        await db.commit()
        return True
