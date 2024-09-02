from pydantic import BaseModel, Field


class ChartTipResponse(BaseModel):
    today_tip: str = Field(..., description="오늘의 투자 tip")


class SummaryResponse(BaseModel):
    today_review_rate: float = Field(..., description="오늘의 review")
    total_asset_amount: int = Field(..., description="나의 총 자산")
    total_investment_amount: int = Field(..., description="나의 투자 금액")
    profit_amount: int = Field(..., description="수익금")
    profit_rate: float = Field(..., description="수익률")
