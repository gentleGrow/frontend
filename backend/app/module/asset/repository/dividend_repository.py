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
    async def save_dividend(
        session: AsyncSession, dividend: float, payment_date: str, dividend_yield: float, stock_code: str
    ) -> Dividend:
        new_dividend = Dividend(
            dividend=dividend, payment_date=payment_date, dividend_yield=dividend_yield, stock_code=stock_code
        )
        session.add(
            Dividend(dividend=dividend, payment_date=payment_date, dividend_yield=dividend_yield, stock_code=stock_code)
        )
        await session.commit()
        return new_dividend
