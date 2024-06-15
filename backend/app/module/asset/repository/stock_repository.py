from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import Stock


class StockRepository:
    @staticmethod
    async def get_stock(session: AsyncSession, stock_id: int) -> Stock:
        stock_instance = await session.execute(select(Stock).where(Stock.id == stock_id))
        return stock_instance.scalar_one_or_none()

    @staticmethod
    async def get_stocks(session: AsyncSession, stock_ids: list[int]) -> list[Stock]:
        result = await session.execute(select(Stock).where(Stock.id.in_(stock_ids)))
        return result.scalars().all()

    @staticmethod
    async def get_by_code(session: AsyncSession, stock_code: str) -> Stock:
        result = await session.execute(select(Stock).where(Stock.code == stock_code))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_codes(session: AsyncSession, stock_codes: list[str]) -> list[Stock]:
        result = await session.execute(select(Stock).where(Stock.code.in_(stock_codes)))
        return result.scalars().all()
