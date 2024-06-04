from pydantic import BaseModel


class AssetResponse(BaseModel):
    code: str
    price: int | float


class AssetTransaction(BaseModel):
    stock_code: str
    quantity: int
    investment_bank: str
    user_id: str


class AssetTransactionRequest(BaseModel):
    transactions: list[AssetTransaction]
