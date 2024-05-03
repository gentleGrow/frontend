from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.asset_management.models import Stock


class StockRepository:
    def save(self, db: Session, stock_code: str, name: str, index_id: str):
        try:
            stock = Stock(stock_id=stock_code, name=name, index_id=index_id)
            db.add(stock)
            db.commit()
            return stock
        except IntegrityError:
            db.rollback()
            return None
