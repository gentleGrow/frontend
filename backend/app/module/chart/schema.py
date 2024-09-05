from pydantic import BaseModel, Field


class ChartTipResponse(BaseModel):
    today_tip: str = Field(..., description="오늘의 투자 tip")


class SummaryResponse(BaseModel):
    today_review_rate: float = Field(..., description="오늘의 review")
    total_asset_amount: int = Field(..., description="나의 총 자산")
    total_investment_amount: int = Field(..., description="나의 투자 금액")
    profit_amount: int = Field(..., description="수익금")
    profit_rate: float = Field(..., description="수익률")


class MarketIndiceResponseValue(BaseModel):
    index_name: str = Field(..., description="시장 지수 명칭")
    current_value: float = Field(..., description="현재 지수")
    change_percent: float = Field(..., description="1일 기준 변동성")
    profit_status: str = Field(..., description="플로스 마이너스 여부")


class MarketIndiceResponse(BaseModel):
    market_indices: list[MarketIndiceResponseValue]


class CompositionResponseValue(BaseModel):
    name: str = Field(..., description="종목 명 혹은 계좌 명")
    percent_rate: float = Field(..., description="비중")
    current_amount: float = Field(..., description="현재가")


class CompositionResponse(BaseModel):
    composition: list[CompositionResponseValue]
