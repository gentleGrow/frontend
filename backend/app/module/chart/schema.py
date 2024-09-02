from pydantic import BaseModel, Field


class ChartTipResponse(BaseModel):
    today_tip: str = Field(..., description="오늘의 투자 tip")


class SummaryResponse(BaseModel):
    today_review_rate: float = Field(..., description="오늘의 review")
    total_asset_amount: int = Field(..., description="나의 총 자산")
    total_investment_amount: int = Field(..., description="나의 투자 금액")
    profit_amount: int = Field(..., description="수익금")
    profit_rate: float = Field(..., description="수익률")


class MarketIndiceResponse(BaseModel):
    market_indices: list[tuple[str, float, float]]


class MarketIndexValue(BaseModel):
    event_type: str
    index_name: str = Field(..., description="인덱스 심볼")
    today_opening_value: float = Field(..., description="오늘 하루 시작가")
    opening_value: float = Field(..., description="1초 내 시작가")
    closing_value: float = Field(..., description="1초 내 종가")
    highest_value: float = Field(..., description="1초 내 최대")
    lowest_value: float = Field(..., description="1초 내 최저")
    start_time: int = Field(..., description="1초 내 시작 시간")
    end_time: int = Field(..., description="1초 내 끝 시간")
