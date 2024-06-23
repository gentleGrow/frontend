from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import Dividend


class DividendRepository:
    @staticmethod
    async def get_dividend(session: AsyncSession, stock_code: str) -> Dividend:
        result = await session.execute(select(Dividend).where(Dividend.stock_code == stock_code))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_dividends(session: AsyncSession, stock_codes: list[str]) -> list[Dividend]:
        result = await session.execute(select(Dividend).where(Dividend.stock_code.in_(stock_codes)))
        return result.scalars().all()

    @staticmethod
    async def save(session: AsyncSession, dividend: Dividend) -> None:
        session.add(dividend)
        await session.commit()
