from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.common.auth.security import verify_jwt_token
from app.modules.asset_management.models import Stock
from app.modules.asset_management.schemas import StockResponse
from database.dependencies import get_mysql_session

asset_management_router = APIRouter()


@asset_management_router.get("/stocks", summary="주식 현재가를 반환합니다.", response_model=list[StockResponse])
async def get_stocks(
    stock_codes: list[str] = Query(..., description="주식 코드 리스트"),
    db: Session = Depends(get_mysql_session),
    token: str = Depends(verify_jwt_token),
) -> list[StockResponse]:
    if not stock_codes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="stock_codes에 1개 이상의 주식 코드가 존재해야 합니다.")

    stocks = db.query(Stock).filter(Stock.code.in_(stock_codes)).all()

    if not stocks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 종목의 코드는 존재하지 않습니다.")

    return [StockResponse(code=stock.code, price=stock.price) for stock in stocks]
