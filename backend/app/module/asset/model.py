from sqlalchemy import (
    Column,
    Date,
    Enum,
    Float,
    ForeignKey,
    Integer,
    PrimaryKeyConstraint,
    String,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.common.mixin.timestamp import TimestampMixin
from app.module.asset.enum import AccountType, AssetType, CurrencyType, InvestmentBankType, VirtualExchangeType
from database.config import MySQLBase

asset_stock = Table(
    "asset_stock",
    MySQLBase.metadata,
    Column("asset_id", Integer, ForeignKey("asset.id"), primary_key=True),
    Column("stock_code", String(255), ForeignKey("stock.code"), primary_key=True),
)


class Asset(TimestampMixin, MySQLBase):
    __tablename__ = "asset"

    id = Column(Integer, primary_key=True, autoincrement=True)
    quantity = Column(Integer, nullable=False)
    investment_bank = Column(Enum(InvestmentBankType), nullable=False, info={"description": "증권사"})
    account_type = Column(Enum(AccountType), nullable=False, info={"description": "계좌 종류"})
    asset_type = Column(Enum(AssetType), nullable=False, info={"description": "자산 종류"})
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    user = relationship("User", back_populates="asset")
    stock = relationship("Stock", secondary=asset_stock, back_populates="asset")


class Stock(TimestampMixin, MySQLBase):
    __tablename__ = "stock"

    code = Column(String(255), primary_key=True, nullable=False)
    name = Column(String(255), nullable=False)
    market_index = Column(String(255), nullable=False)

    asset = relationship("Asset", secondary=asset_stock, back_populates="stock")
    daily_price = relationship("StockDaily", back_populates="stock")
    weekly_price = relationship("StockWeekly", back_populates="stock")
    monthly_price = relationship("StockMonthly", back_populates="stock")


class StockDaily(MySQLBase):
    __tablename__ = "stock_daily"

    code = Column(String(255), ForeignKey("stock.code"), primary_key=True, nullable=False)
    date = Column(Date, primary_key=True, nullable=False, info={"description": "stock closing day"})
    opening_price = Column(Float, nullable=False, info={"description": "Opening price of the stock"})
    highest_price = Column(Float, nullable=False, info={"description": "Highest price of the stock"})
    lowest_price = Column(Float, nullable=False, info={"description": "Lowest price of the stock"})
    close_price = Column(Float, nullable=False, info={"description": "Closing price of the stock"})
    adj_close_price = Column(Float, nullable=False, info={"description": "Adjusted closing price of the stock"})
    trade_volume = Column(Integer, nullable=False, info={"description": "Volume of stock traded"})
    stock = relationship("Stock", back_populates="daily_price")

    __table_args__ = (PrimaryKeyConstraint("code", "date", name="pk_stock_daily"),)


class StockWeekly(MySQLBase):
    __tablename__ = "stock_weekly"

    code = Column(String(255), ForeignKey("stock.code"), primary_key=True, nullable=False)
    date = Column(Date, primary_key=True, nullable=False, info={"description": "stock closing week"})
    opening_price = Column(Float, nullable=False, info={"description": "Opening price of the stock"})
    highest_price = Column(Float, nullable=False, info={"description": "Highest price of the stock"})
    lowest_price = Column(Float, nullable=False, info={"description": "Lowest price of the stock"})
    close_price = Column(Float, nullable=False, info={"description": "Closing price of the stock"})
    adj_close_price = Column(Float, nullable=False, info={"description": "Adjusted closing price of the stock"})
    trade_volume = Column(Integer, nullable=False, info={"description": "Volume of stock traded"})

    stock = relationship("Stock", back_populates="weekly_price")

    __table_args__ = (PrimaryKeyConstraint("code", "date", name="pk_stock_weekly"),)


class StockMonthly(MySQLBase):
    __tablename__ = "stock_monthly"

    code = Column(String(255), ForeignKey("stock.code"), primary_key=True, nullable=False)
    date = Column(Date, primary_key=True, nullable=False, info={"description": "stock closing month"})
    opening_price = Column(Float, nullable=False, info={"description": "Opening price of the stock"})
    highest_price = Column(Float, nullable=False, info={"description": "Highest price of the stock"})
    lowest_price = Column(Float, nullable=False, info={"description": "Lowest price of the stock"})
    close_price = Column(Float, nullable=False, info={"description": "Closing price of the stock"})
    adj_close_price = Column(Float, nullable=False, info={"description": "Adjusted closing price of the stock"})
    trade_volume = Column(Integer, nullable=False, info={"description": "Volume of stock traded"})

    stock = relationship("Stock", back_populates="monthly_price")

    __table_args__ = (PrimaryKeyConstraint("code", "date", name="pk_stock_monthly"),)


class Bond(TimestampMixin, MySQLBase):
    __tablename__ = "bond"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    maturity_date = Column(Date, nullable=False, info={"description": "만기일"})
    coupon_rate = Column(Float, nullable=False, info={"description": "이자율"})


class VirtualAsset(TimestampMixin, MySQLBase):
    __tablename__ = "virtual_asset"

    code = Column(String(255), primary_key=True, nullable=False)
    name = Column(String(255), nullable=False)
    exchange = Column(Enum(VirtualExchangeType), nullable=True, info={"description": "거래소"})


class Currency(TimestampMixin, MySQLBase):
    __tablename__ = "currency"

    type = Column(Enum(CurrencyType), primary_key=True, nullable=False)

    __table_args__ = (UniqueConstraint("type", name="uq_currency_type"),)
