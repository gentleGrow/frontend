from pydantic import BaseModel, Field


class StockRow(BaseModel):
    date: str = Field(..., description="Date of the stock entry")
    open: float = Field(..., description="Opening price of the stock")
    high: float = Field(..., description="Highest price of the stock")
    low: float = Field(..., description="Lowest price of the stock")
    close: float = Field(..., description="Closing price of the stock")
    adj_close: float = Field(..., description="Adjusted closing price of the stock")
    volume: int = Field(..., description="Volume of stock traded")
