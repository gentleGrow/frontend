from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import StockDaily


class StockDailyRepository:
    @staticmethod
    async def get_stock_daily(session: AsyncSession, stock_code: str, stock_date: date) -> StockDaily:
        stmt = select(StockDaily).where(StockDaily.code == stock_code, StockDaily.date == stock_date)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_most_recent_stock_daily(session: AsyncSession, stock_code: str) -> StockDaily:
        stmt = select(StockDaily).where(StockDaily.code == stock_code).order_by(StockDaily.date.desc()).limit(1)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
