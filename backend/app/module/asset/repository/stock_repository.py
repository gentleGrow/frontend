from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import Stock
from app.module.asset.schema.stock_schema import StockCodeList


class StockRepository:
    @staticmethod
    async def get_stocks_by_codes(db: AsyncSession, stock_codes: StockCodeList) -> list[Stock]:
        query = select(Stock).where(Stock.code.in_([stock_code.code for stock_code in stock_codes.codes]))
        stock_instance = await db.execute(query)
        return stock_instance.scalars().all()
