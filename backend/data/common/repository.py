from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.asset_management.models import Stock, StockDaily, StockMonthly, StockWeekly


class StockRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, stock: Stock) -> Stock:
        self.session.add(stock)
        await self.session.commit()
        await self.session.refresh(stock)
        return stock


class StockDailyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, stock_daily: StockDaily) -> StockDaily:
        self.session.add(stock_daily)
        await self.session.commit()
        await self.session.refresh(stock_daily)
        return stock_daily


class StockWeeklyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, stock_weekly: StockWeekly) -> StockWeekly:
        self.session.add(stock_weekly)
        await self.session.commit()
        await self.session.refresh(stock_weekly)
        return stock_weekly


class StockMonthlyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, stock_monthly: StockMonthly) -> StockMonthly:
        self.session.add(stock_monthly)
        await self.session.commit()
        await self.session.refresh(stock_monthly)
        return stock_monthly
