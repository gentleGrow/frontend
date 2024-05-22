from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.common.repository.base_repository import AbstractCRUDRepository
from app.modules.asset_management.models import StockTransaction
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


class StockTransactionRepository:
    @staticmethod
    async def get_transactions(db: AsyncSession, user_id: str) -> list[StockTransaction]:
        result = await db.execute(select(StockTransaction).filter(StockTransaction.user_id == user_id))
        return result.scalars().all()

    @staticmethod
    async def save_transactions(db: AsyncSession, stock_transactions: list[StockTransaction]) -> bool:
        transactions = [
            StockTransaction(
                id=StockTransaction.get_uuid(),
                quantity=stock_transaction.quantity,
                investment_bank=stock_transaction.investment_bank,
                stock_id=stock_transaction.stock_code,
                user_id=stock_transaction.user_id,
            )
            for stock_transaction in stock_transactions
        ]
        db.add_all(transactions)
        await db.commit()
        return True

    @staticmethod
    async def update_transactions(db: AsyncSession, stock_transaction: list[StockTransaction]) -> bool:
        transaction_ids = [stock_transaction.id for stock_transaction in stock_transaction]
        existing_transactions = await db.execute(
            select(StockTransaction).filter(StockTransaction.id.in_(transaction_ids))
        )
        existing_transactions = existing_transactions.scalars().all()

        transaction_map = {transaction.id: transaction for transaction in existing_transactions}

        for stock_transaction in stock_transaction:
            transaction = transaction_map.get(stock_transaction.id)
            if transaction is None:
                continue
            transaction.quantity = stock_transaction.quantity
            transaction.investment_bank = stock_transaction.investment_bank
            transaction.stock_id = stock_transaction.stock_code
            transaction.user_id = stock_transaction.user_id

        await db.commit()
        return True
