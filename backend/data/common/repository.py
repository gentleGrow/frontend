from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import Stock, StockDaily, StockMonthly, StockWeekly


class StockRepository:
    @staticmethod
    async def save(
        session: AsyncSession, stock: Stock | StockDaily | StockWeekly | StockMonthly
    ) -> Stock | StockDaily | StockWeekly | StockMonthly:
        session.add(stock)
        await session.commit()
        await session.refresh(stock)
        return stock

    @staticmethod
    async def bulk_save(session: AsyncSession, stocks: list[Stock | StockDaily | StockWeekly | StockMonthly]) -> None:
        session.add_all(stocks)
        await session.commit()
