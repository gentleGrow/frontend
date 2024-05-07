from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.asset_management.models import Stock
from data.common.config import logging
from data.common.schemas import StockList, StockPriceList


class StockRepository:
    def save(self, db_session_factory: Session, stock_code_chunk: StockList, price_list: StockPriceList):
        with db_session_factory() as session:
            try:
                logging.info(f"{stock_code_chunk=} {price_list=}")
                for (stock_code, stock_name, market_index), price in zip(stock_code_chunk, price_list):
                    session.add(Stock(code=stock_code, name=stock_name, market_index=market_index, price=int(price)))

                session.commit()
            except IntegrityError as error:
                logging.info(f"stock repository save : {error=}")
                session.rollback()
                return None
