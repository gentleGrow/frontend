from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.modules.asset.repository import AssetTransactionRepository
from app.modules.asset.schemas import StockTransaction, StockTransactionRequest
from database.dependencies import get_mysql_session

asset_router = APIRouter(prefix="/v1")


@asset_router.get("/assets", summary="사용자의 자산 정보를 반환합니다.", response_model=list[StockTransaction])
async def get_assets(
    token: dict = Depends(verify_jwt_token), db: AsyncSession = Depends(get_mysql_session)
) -> list[StockTransaction]:
    user_id = token.get("sub")
    if user_id is None:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자 id를 찾지 못하였습니다.")

    try:
        result = await AssetTransactionRepository.get_assets(db, user_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자의 자산관리 정보를 찾지 못하였습니다.")
    else:
        return result


@asset_router.post("/assets", summary="자산관리 정보를 등록합니다.", response_model=JSONResponse)
async def save_assets(
    transaction_data: StockTransactionRequest,
    token: dict = Depends(verify_jwt_token),
    db: AsyncSession = Depends(get_mysql_session),
) -> JSONResponse:
    try:
        await AssetTransactionRepository.save_assets(db, transaction_data.transactions)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="자산 정보를 저장하는데 실패하였습니다.")
    else:
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"detail": "자산 정보가 성공적으로 저장되었습니다."})


@asset_router.put("/assets", summary="자산관리 정보를 수정합니다.", response_model=JSONResponse)
async def update_assets(
    transaction_data: StockTransactionRequest,
    token: dict = Depends(verify_jwt_token),
    db: AsyncSession = Depends(get_mysql_session),
) -> JSONResponse:
    try:
        await AssetTransactionRepository.update_assets(db, transaction_data.transactions)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 자산관리 정보를 찾지 못하였습니다.")
    else:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
