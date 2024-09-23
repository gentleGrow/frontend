from datetime import date
from typing import Optional

from pydantic import BaseModel, Field, RootModel

from app.module.asset.enum import AccountType, PurchaseCurrencyType
from app.module.asset.model import Asset


class StockAsset(BaseModel):
    id: Optional[int] = None
    account_type: AccountType | None = Field(..., description="계좌 종류")
    buy_date: date = Field(..., description="구매일자")
    current_price: float = Field(..., description="현재가")
    dividend: float = Field(..., description="배당금")
    highest_price: float = Field(..., description="주식 하루 중 고가")
    investment_bank: str | None = Field(..., description="증권사", examples=["토스증권"])
    lowest_price: float = Field(..., description="주식 하루 중 저가")
    opening_price: float = Field(..., description="주식 하루 중 시가, 시작되는 가격")
    profit_rate: float = Field(..., description="수익률")
    profit_amount: float = Field(..., description="수익금")
    purchase_amount: float | None = Field(..., description="매입금액")
    purchase_price: float | None = Field(..., description="매입가")
    purchase_currency_type: PurchaseCurrencyType = Field(..., description="매입 통화")
    quantity: int = Field(..., description="수량")
    stock_code: str = Field(..., description="종목 코드", examples=["AAPL"])
    stock_name: str = Field(..., description="종목명", examples=["BGF리테일"])
    stock_volume: int = Field(..., description="주식 하루 중 거래량")


class StockAssetRequest(BaseModel):
    id: Optional[int] = None
    account_type: AccountType = Field(..., description="계좌 종류")
    buy_date: date = Field(..., description="구매일자")
    investment_bank: str = Field(..., description="증권사", examples=["토스증권"])
    purchase_price: float = Field(..., description="매입가")
    purchase_currency_type: PurchaseCurrencyType = Field(..., description="매입 통화")
    quantity: int = Field(..., description="수량")
    stock_code: str = Field(..., description="종목 코드", examples=["AAPL"])


class BankAccountResponse(BaseModel):
    investment_bank_list: list[str]
    account_list: list[str]


class StockListValue(BaseModel):
    name: str
    code: str


class StockListResponse(RootModel[list[StockListValue]]):
    pass


class StockAssetResponse(BaseModel):
    stock_assets: list[StockAsset]
    total_asset_amount: float
    total_invest_amount: float
    total_profit_rate: float
    total_profit_amount: float
    total_dividend_amount: float

    @classmethod
    def parse(
        cls,
        stock_assets: list[StockAsset],
        total_asset_amount: float,
        total_invest_amount: float,
        total_dividend_amount: float,
    ) -> "StockAssetResponse":
        return cls(
            stock_assets=stock_assets,
            total_asset_amount=total_asset_amount,
            total_invest_amount=total_invest_amount,
            total_profit_rate=((total_asset_amount - total_invest_amount) / total_invest_amount) * 100 if total_invest_amount > 0 else 0.0,
            total_profit_amount=total_asset_amount - total_invest_amount,
            total_dividend_amount=total_dividend_amount,
        )

    @staticmethod
    def validate_assets(assets: list[Asset]) -> Optional["StockAssetResponse"]:
        if len(assets) == 0:
            return StockAssetResponse(
                stock_assets=[],
                total_asset_amount=0.0,
                total_invest_amount=0.0,
                total_profit_rate=0.0,
                total_profit_amount=0.0,
                total_dividend_amount=0.0,
            )
        return None


class StockInfo(BaseModel):
    code: str = Field(..., description="종목 코드", examples="095570")
    name: str = Field(..., description="종목명", examples="BGF리테일")
    country: str = Field(..., description="나라명", examples="Korea")
    market_index: str = Field(..., description="주가 지수", examples="KOSPI")


class MarketIndexData(BaseModel):
    country: str = Field(..., description="Country of the market index")
    name: str = Field(..., description="Name of the market index")
    current_value: str = Field(..., description="Current value of the index")
    change_value: str = Field(..., description="The change in value from the previous close")
    change_percent: str = Field(..., description="The percentage change from the previous close")
    update_time: str = Field(..., description="The time at which the data was last updated")
