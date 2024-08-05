from sqlalchemy.dialects.mysql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func

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

    @staticmethod
    async def upsert(session: AsyncSession, dividend: Dividend) -> None:
        try:
            dividend_value = float(dividend.dividend)
            stock_code_value = str(dividend.stock_code)
        except Exception:
            print(f"올바른 타입이 아닙니다. {dividend.stock_code=}, {dividend.dividend=}")
            raise

        query_statement = insert(Dividend).values(
            dividend=dividend_value,
            stock_code=stock_code_value,
        )
        on_duplicate_stmt = query_statement.on_duplicate_key_update(
            dividend=query_statement.inserted.dividend, updated_at=func.now()
        )

        await session.execute(on_duplicate_stmt)
        await session.commit()
