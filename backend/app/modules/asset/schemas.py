from pydantic import BaseModel


class StockResponse(BaseModel):
    code: str
    price: int | float


class StockTransaction(BaseModel):
    stock_code: str
    quantity: int
    investment_bank: str
    user_id: str


class StockTransactionRequest(BaseModel):
    transactions: list[StockTransaction]
