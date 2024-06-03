from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.asset.models import Stock, StockDaily, StockMonthly, StockWeekly


class StockRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(
        self, stock: Stock | StockDaily | StockWeekly | StockMonthly
    ) -> Stock | StockDaily | StockWeekly | StockMonthly:
        self.session.add(stock)
        await self.session.commit()
        await self.session.refresh(stock)
        return stock
