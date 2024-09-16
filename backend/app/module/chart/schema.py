from datetime import date, datetime

from pydantic import BaseModel, Field

from app.module.asset.constant import MARKET_INDEX_KR_MAPPING
from app.module.asset.enum import MarketIndex


class ChartTipResponse(BaseModel):
    today_tip: str = Field(..., description="오늘의 투자 tip")


class SummaryResponse(BaseModel):
    today_review_rate: float = Field(..., description="오늘의 review")
    total_asset_amount: int = Field(..., description="나의 총 자산")
    total_investment_amount: int = Field(..., description="나의 투자 금액")
    profit_amount: int = Field(..., description="수익금")
    profit_rate: float = Field(..., description="수익률")


class MarketIndiceResponseValue(BaseModel):
    name: str = Field(..., example=f"{', '.join([e.value for e in MarketIndex])}")
    name_kr: str = Field(..., description="한국어 지수 이름", example=f"{', '.join(MARKET_INDEX_KR_MAPPING.values())}")
    current_value: float = Field(..., description="현재 지수")
    change_percent: float = Field(..., description="1일 기준 변동성")


class MarketIndiceResponse(BaseModel):
    market_indices: list[MarketIndiceResponseValue]


class CompositionResponseValue(BaseModel):
    name: str = Field(..., description="종목 명 혹은 계좌 명")
    percent_rate: float = Field(..., description="비중")
    current_amount: float = Field(..., description="현재가")


class CompositionResponse(BaseModel):
    composition: list[CompositionResponseValue]


class PerformanceAnalysisResponseValue(BaseModel):
    name: str = Field(..., description="대상")
    interval_date: date | datetime = Field(..., description="날짜")
    profit: float = Field(..., description="수익률")


class PerformanceAnalysisResponse(BaseModel):
    performance_analysis: dict[str, list[PerformanceAnalysisResponseValue]]


class EstimateDividendEveryValue(BaseModel):
    date: date
    amount: float


class EstimateDividendEveryResponse(BaseModel):
    estimate_dividend_list: list[EstimateDividendEveryValue]
    
    
class EstimateDividendTypeValue(BaseModel):
    code: str
    amount: float
    composition_rate: float

    
class EstimateDividendTypeResponse(BaseModel):
    estimate_dividend_list: list[EstimateDividendTypeValue]


class MyStockResponseValue(BaseModel):
    name: str
    current_price: float
    profit_rate: float
    profit_amount: float
    quantity: int


class MyStockResponse(BaseModel):
    my_stock_list: list[MyStockResponseValue]
