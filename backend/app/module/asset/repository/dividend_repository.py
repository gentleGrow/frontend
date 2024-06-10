from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import Dividend


class DividendRepository:
    @staticmethod
    async def save_dividend(
        session: AsyncSession, dividend_amount: float, payment_date: str, dividend_yield: float, stock_code: str
    ):
        new_dividend = Dividend(
            dividend=dividend_amount, payment_date=payment_date, dividend_yield=dividend_yield, stock_code=stock_code
        )
        session.add(new_dividend)
        await session.commit()
        return new_dividend
