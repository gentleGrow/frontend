from uuid import uuid4

from sqlalchemy import Column, Date, Float, ForeignKey, Integer, PrimaryKeyConstraint, String
from sqlalchemy.orm import relationship

from app.common.mixins.timestamps import TimestampMixin
from database.config import MySQLBase


class Stock(TimestampMixin, MySQLBase):
    __tablename__ = "stocks"

    code = Column(String(255), primary_key=True, nullable=False)
    name = Column(String(255), nullable=False)
    market_index = Column(String(255), nullable=False)

    transactions = relationship("StockTransaction", back_populates="stock")
    daily_prices = relationship("StockDaily", back_populates="stock")
    weekly_prices = relationship("StockWeekly", back_populates="stock")
    monthly_prices = relationship("StockMonthly", back_populates="stock")


class StockDaily(MySQLBase):
    __tablename__ = "stock_daily"

    code = Column(String(255), ForeignKey("stocks.code"), primary_key=True, nullable=False)
    date = Column(Date, primary_key=True, nullable=False, info={"description": "stock closing day"})
    opening_price = Column(Float, nullable=False, info={"description": "Opening price of the stock"})
    highest_price = Column(Float, nullable=False, info={"description": "Highest price of the stock"})
    lowest_price = Column(Float, nullable=False, info={"description": "Lowest price of the stock"})
    close_price = Column(Float, nullable=False, info={"description": "Closing price of the stock"})
    adj_close_price = Column(Float, nullable=False, info={"description": "Adjusted closing price of the stock"})
    trade_volume = Column(Integer, nullable=False, info={"description": "Volume of stock traded"})

    stock = relationship("Stock", back_populates="daily_prices")

    __table_args__ = (PrimaryKeyConstraint("code", "date", name="pk_stock_daily"),)


class StockWeekly(MySQLBase):
    __tablename__ = "stock_weekly"

    code = Column(String(255), ForeignKey("stocks.code"), primary_key=True, nullable=False)
    date = Column(Date, primary_key=True, nullable=False, info={"description": "stock closing week"})
    opening_price = Column(Float, nullable=False, info={"description": "Opening price of the stock"})
    highest_price = Column(Float, nullable=False, info={"description": "Highest price of the stock"})
    lowest_price = Column(Float, nullable=False, info={"description": "Lowest price of the stock"})
    close_price = Column(Float, nullable=False, info={"description": "Closing price of the stock"})
    adj_close_price = Column(Float, nullable=False, info={"description": "Adjusted closing price of the stock"})
    trade_volume = Column(Integer, nullable=False, info={"description": "Volume of stock traded"})

    stock = relationship("Stock", back_populates="weekly_prices")

    __table_args__ = (PrimaryKeyConstraint("code", "date", name="pk_stock_weekly"),)


class StockMonthly(MySQLBase):
    __tablename__ = "stock_monthly"

    code = Column(String(255), ForeignKey("stocks.code"), primary_key=True, nullable=False)
    date = Column(Date, primary_key=True, nullable=False, info={"description": "stock closing month"})
    opening_price = Column(Float, nullable=False, info={"description": "Opening price of the stock"})
    highest_price = Column(Float, nullable=False, info={"description": "Highest price of the stock"})
    lowest_price = Column(Float, nullable=False, info={"description": "Lowest price of the stock"})
    close_price = Column(Float, nullable=False, info={"description": "Closing price of the stock"})
    adj_close_price = Column(Float, nullable=False, info={"description": "Adjusted closing price of the stock"})
    trade_volume = Column(Integer, nullable=False, info={"description": "Volume of stock traded"})

    stock = relationship("Stock", back_populates="monthly_prices")

    __table_args__ = (PrimaryKeyConstraint("code", "date", name="pk_stock_monthly"),)


class StockTransaction(TimestampMixin, MySQLBase):
    __tablename__ = "stock_transactions"

    @staticmethod
    def get_uuid():
        return str(uuid4())

    id = Column(String(36), primary_key=True, default=get_uuid)
    quantity = Column(Integer, nullable=False)
    investment_bank = Column(String(255), nullable=False)
    stock_id = Column(String(255), ForeignKey("stocks.code"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="transactions")
    stock = relationship("Stock", back_populates="transactions")
