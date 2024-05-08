from pydantic import BaseModel


class StockResponse(BaseModel):
    code: str
    price: int
