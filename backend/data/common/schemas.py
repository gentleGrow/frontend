from pydantic import BaseModel, Field


class StockInfo(BaseModel):
    code: str = Field(..., description="종목 코드", examples="095570")
    name: str = Field(..., description="종목명", examples="BGF리테일")
    market_index: str = Field(..., description="주가 지수", examples="KOSPI")


class StockPrice(BaseModel):
    price: int = Field(..., description="주가 현재가", examples="14930")


class StockList(BaseModel):
    stocks: list[StockInfo]


class StockPriceList(BaseModel):
    price: list[StockPrice]
