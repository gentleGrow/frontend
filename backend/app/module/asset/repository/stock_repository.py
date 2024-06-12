from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import Stock
from app.module.asset.schema.stock_schema import StockCodeList


class StockRepository:
    @staticmethod
    async def get_stock(session: AsyncSession, stock_id: int) -> Stock:
        query = select(Stock).where(Stock.id == stock_id)
        stock_instance = await session.execute(query)
        return stock_instance.scalar_one_or_none()

    @staticmethod
    async def get_stocks_by_codes(session: AsyncSession, stock_codes: StockCodeList) -> list[Stock]:
        query = select(Stock).where(Stock.code.in_([stock_code.code for stock_code in stock_codes.codes]))
        stock_instance = await session.execute(query)
        return stock_instance.scalars().all()

    @staticmethod
    async def get_by_code(session: AsyncSession, stock_code: str) -> Stock:
        query = select(Stock).where(Stock.code == stock_code)
        stock_instance = await session.execute(query)
        return stock_instance.scalar_one_or_none()
