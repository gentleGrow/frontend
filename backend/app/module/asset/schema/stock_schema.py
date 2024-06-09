from datetime import date

from pydantic import BaseModel, Field


class StockAsset(BaseModel):
    stock_name: str = Field(..., description="종목명", examples="BGF리테일")
    quantity: int = Field(..., description="수량")
    buy_date: date = Field(..., description="구매일자")
    profit: float = Field(..., description="수익률")
    highest_price: float = Field(..., description="주식 하루 중 고가")
    lowest_price: float = Field(..., description="주식 하루 중 저가")
    stock_volume: int = Field(..., description="주식 하루 중 거래량")
    investment_bank: str = Field(..., description="증권사", examples="토스증권")
    dividend: float = Field(..., description="배당금")
    purchase_price: float = Field(..., description="매입가")
    purchase_amount: float = Field(..., description="매입금액")


class StockAssetResponse(BaseModel):
    stock_assets: list[StockAsset]
    total_asset_amount: float
    total_asset_growth_rate: float
    total_invest_amount: float
    total_invest_growth_rate: float
    total_profit_amount: float
    total_profit_rate: float
    total_dividend_amount: float
    total_dividend_rate: float


class StockCode(BaseModel):
    code: str = Field(..., description="종목 코드", examples="095570")


class StockCodeList(BaseModel):
    codes: list[StockCode]


class StockInfo(BaseModel):
    code: str = Field(..., description="종목 코드", examples="095570")
    name: str = Field(..., description="종목명", examples="BGF리테일")
    market_index: str = Field(..., description="주가 지수", examples="KOSPI")


class StockPrice(BaseModel):
    price: int = Field(..., description="주가 현재가", examples="14930")


class StockList(BaseModel):
    stocks: list[StockInfo]


class StockPriceList(BaseModel):
    prices: list[StockPrice]


class RealtimeStockInfo(BaseModel):
    code: str = Field(..., description="종목 코드", examples="095570")
    name: str = Field(..., description="종목명", examples="BGF리테일")


class RealtimeStockList(BaseModel):
    stocks: list[RealtimeStockInfo]
