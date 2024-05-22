from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.common.auth.security import verify_jwt_token
from app.common.utils.logging import logging
from app.modules.asset_management.schemas import StockResponse
from database.singleton import redis_stock_repository

asset_management_router = APIRouter()


@asset_management_router.get("/stocks", summary="주식 현재가를 반환합니다.", response_model=list[StockResponse])
async def get_current_stock_price(
    stock_codes: list[str] = Query(..., description="주식 코드 리스트"),
    token: str = Depends(verify_jwt_token),
) -> list[StockResponse]:
    if not stock_codes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="stock_codes에 1개 이상의 주식 코드가 존재해야 합니다.")

    result = []

    for code in stock_codes:
        price = await redis_stock_repository.get(code)

        if price is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"해당 종목의 코드는 존재하지 않습니다: {code}")

        logging.info(f"[get_current_stock_price] {code=} {price=}")
        result.append(StockResponse(code=code, price=float(price)))

    return result
