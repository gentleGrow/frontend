from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.modules.asset_management.repository import StockTransactionRepository
from app.modules.asset_management.schemas import StockResponse, StockTransaction, StockTransactionRequest
from database.dependencies import get_mysql_session
from database.singleton import redis_stock_repository

asset_management_router = APIRouter(prefix="/v1")


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

        result.append(StockResponse(code=code, price=float(price)))

    return result


@asset_management_router.get("/transactions", summary="사용자의 자산관리 정보를 반환합니다.", response_model=list[StockTransaction])
async def get_stock_transactions(
    token=Depends(verify_jwt_token), db: AsyncSession = Depends(get_mysql_session)
) -> list[StockTransaction]:
    try:
        user_id = token.get("sub")
        return await StockTransactionRepository.get_transactions(db, user_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자의 자산관리 정보를 찾지 못하였습니다.")


@asset_management_router.post("/transactions", summary="자산관리 정보를 등록합니다.")
async def save_stock_transactions(
    transaction_data: StockTransactionRequest,
    token: str = Depends(verify_jwt_token),
    db: AsyncSession = Depends(get_mysql_session),
) -> JSONResponse:
    try:
        await StockTransactionRepository.save_transactions(db, transaction_data.transactions)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"detail": "자산 정보가 성공적으로 저장되었습니다."})
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="자산 정보를 저장하는데 실패하였습니다.")


@asset_management_router.put("/transactions", summary="자산관리 정보를 수정합니다.")
async def update_stock_transactions(
    transaction_data: StockTransactionRequest,
    token: str = Depends(verify_jwt_token),
    db: AsyncSession = Depends(get_mysql_session),
) -> JSONResponse:
    try:
        await StockTransactionRepository.update_transactions(db, transaction_data.transactions)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 자산관리 정보를 찾지 못하였습니다.")
