from app.module.asset.model import Stock, StockDaily, StockMonthly, StockWeekly


class StockRepository:
    @staticmethod
    async def save(
        session, stock: Stock | StockDaily | StockWeekly | StockMonthly
    ) -> Stock | StockDaily | StockWeekly | StockMonthly:
        session.add(stock)
        await session.commit()
        await session.refresh(stock)
        return stock
