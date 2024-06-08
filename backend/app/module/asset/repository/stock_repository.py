from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.model import Stock
from app.module.asset.schema.stock_schema import StockCodeList, StockInfo, StockList


class StockRepository:
    @staticmethod
    async def get_stocks_by_codes(db: AsyncSession, stock_codes: StockCodeList) -> StockList:
        query = select(Stock).where(Stock.code.in_([stock_code.code for stock_code in stock_codes.codes]))
        result = await db.execute(query)
        stocks = result.scalars().all()

        stock_info_list = [
            StockInfo(code=stock.code, name=stock.name, market_index=stock.market_index) for stock in stocks
        ]
        return StockList(stocks=stock_info_list)
