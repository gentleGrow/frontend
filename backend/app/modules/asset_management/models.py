from uuid import uuid4

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.common.mixins.timestamps import TimestampMixin
from database.config import MySQLBase


class StockIndex(MySQLBase):
    __tablename__ = "stock_indices"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)

    stocks = relationship("Stock", back_populates="index")


class Stock(MySQLBase):
    __tablename__ = "stocks"

    id = Column(String(36), primary_key=True)
    name = Column(String(255))
    index_id = Column(String(36), ForeignKey("stock_indices.id"))

    index = relationship("StockIndex", back_populates="stocks")
    transactions = relationship("StockTransaction", back_populates="stock")


class StockTransaction(TimestampMixin, MySQLBase):
    __tablename__ = "stock_transactions"

    @staticmethod
    def get_uuid():
        return str(uuid4())

    id = Column(String(36), primary_key=True, default=get_uuid)
    quantity = Column(Integer, nullable=False)
    investment_back = Column(String(255), nullable=False)

    user = relationship("User", back_populates="transactions")
    stock = relationship("Stock", back_populates="transactions")
