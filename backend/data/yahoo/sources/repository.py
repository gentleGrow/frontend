from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.asset_management.models import Stock


class StockRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, stock: Stock) -> Stock:
        self.session.add(stock)
        await self.session.commit()
        await self.session.refresh(stock)
        return stock
