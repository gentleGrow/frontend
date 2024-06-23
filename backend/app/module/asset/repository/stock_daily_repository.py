from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import StockDaily


class StockDailyRepository:
    @staticmethod
    async def get_stock_daily(session: AsyncSession, stock_code: str, stock_date: date) -> StockDaily:
        result = await session.execute(
            select(StockDaily).where(StockDaily.code == stock_code, StockDaily.date == stock_date)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_stock_dailies(session: AsyncSession, stock_codes: list[str]) -> list[StockDaily]:
        result = await session.execute(select(StockDaily).where(StockDaily.code.in_(stock_codes)))
        return result.scalars().all()

    @staticmethod
    async def get_most_recent_stock_daily(session: AsyncSession, stock_code: str) -> StockDaily:
        result = await session.execute(
            select(StockDaily).where(StockDaily.code == stock_code).order_by(StockDaily.date.desc()).limit(1)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_most_recent_stock_dailies(session: AsyncSession, stock_codes: list[str]) -> list[StockDaily]:
        result = await session.execute(
            select(StockDaily).where(StockDaily.code.in_(stock_codes)).order_by(StockDaily.date.desc())
        )
        return result.scalars().all()
