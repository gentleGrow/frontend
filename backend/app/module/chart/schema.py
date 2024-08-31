from pydantic import BaseModel, Field


class ChartTipResponse(BaseModel):
    today_tip: str = Field(..., description="오늘의 투자 tip")
