from datetime import date

from pydantic import BaseModel, Field


class StockAsset(BaseModel):
    stock_code: str = Field(..., description="종목 코드", examples="AAPL")
    stock_name: str = Field(..., description="종목명", examples="BGF리테일")
    quantity: int = Field(..., description="수량")
    buy_date: date = Field(..., description="구매일자")
    profit: float = Field(..., description="수익률")
    current_price: float = Field(..., description="현재가")
    opening_price: float = Field(..., description="주식 하루 중 시가, 시작되는 가격")
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
    total_invest_amount: float
    total_invest_growth_rate: float
    total_profit_amount: float
    total_dividend_amount: float

    @classmethod
    def parse(
        cls,
        stock_assets: list[StockAsset],
        total_asset_amount: float,
        total_invest_amount: float,
        total_invest_growth_rate: float,
        total_dividend_amount: float,
    ) -> "StockAssetResponse":
        return cls(
            stock_assets=stock_assets,
            total_asset_amount=total_asset_amount,
            total_invest_amount=total_invest_amount,
            total_invest_growth_rate=total_invest_growth_rate,
            total_profit_amount=total_asset_amount - total_invest_amount,
            total_dividend_amount=total_dividend_amount,
        )


class StockInfo(BaseModel):
    code: str = Field(..., description="종목 코드", examples="095570")
    name: str = Field(..., description="종목명", examples="BGF리테일")
    country: str = Field(..., description="나라명", examples="Korea")
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
