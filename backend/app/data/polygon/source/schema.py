from pydantic import BaseModel, Field


class RealTimeStock(BaseModel):
    sym: str = Field(..., description="The ticker symbol for the given stock")
    vw: float = Field(..., description="The tick's volume weighted average price.")
