from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.asset_management.models import Stock
from data.common.config import logging
from data.common.schemas import StockList, StockPriceList


class StockRepository:
    async def save(self, db_session_factory: AsyncSession, stock_code_chunk: StockList, price_list: StockPriceList):
        async with db_session_factory() as session:
            try:
                logging.info(f"{stock_code_chunk=} {price_list=}")
                for stock_info, stock_price in zip(stock_code_chunk.stocks, price_list.prices):
                    session.add(
                        Stock(
                            code=stock_info.code,
                            name=stock_info.name,
                            market_index=stock_info.market_index,
                            price=stock_price.price,
                        )
                    )
                await session.commit()
            except IntegrityError as error:
                logging.info(f"stock repository save : {error=}")
                await session.rollback()
