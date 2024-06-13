from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.common.schema import JsonResponse
from app.module.asset.model import AssetStock, Stock, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.asset_stock_repository import AssetStockRepository
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.repository.stock_repository import StockRepository
from app.module.asset.schema.asset_schema import AssetTransaction, AssetTransactionRequest
from app.module.asset.schema.stock_schema import StockAsset, StockAssetResponse
from app.module.auth.constant import DUMMY_USER_ID
from database.dependency import get_mysql_session
from database.singleton import redis_stock_repository

asset_router = APIRouter(prefix="/v1")


@asset_router.get("/dummy/asset", summary="임시 자산 정보를 반환합니다.", response_model=StockAssetResponse)
async def get_dummy_assets(session: AsyncSession = Depends(get_mysql_session)) -> StockAssetResponse:
    cached_response = await redis_stock_repository.get_dummy_asset()
    if cached_response:
        return cached_response

    dummy_assets = await AssetRepository.get_asset_stock(session, DUMMY_USER_ID)

    stock_assets = []
    total_asset_amount = 0
    total_asset_growth_rate = 0
    total_invest_amount = 0
    total_invest_growth_rate = 0
    total_profit_amount = 0
    total_profit_rate = 0
    total_dividend_amount = 0
    total_dividend_rate = 0

    for asset in dummy_assets:
        asset_stock: AssetStock = await AssetStockRepository.get_asset_stock(session, asset.id)

        stock: Stock = await StockRepository.get_stock(session, asset_stock.stock_id)

        stock_daily: StockDaily = await StockDailyRepository.get_stock_daily(session, stock.code, asset.purchase_date)
        purchase_price = (
            asset_stock.purchase_price if asset_stock.purchase_price is not None else stock_daily.adj_close_price
        )
        dividend = await DividendRepository.get_dividend(session, stock.code)

        current_stock_daily: StockDaily = await StockDailyRepository.get_most_recent_stock_daily(session, stock.code)

        profit = (stock_daily.adj_close_price / current_stock_daily.adj_close_price - 1) * 100

        stock_asset = StockAsset(
            stock_code=stock.code,
            stock_name=stock.name,
            quantity=asset.quantity,
            buy_date=asset.purchase_date,
            profit=profit,
            highest_price=stock_daily.highest_price,
            lowest_price=stock_daily.lowest_price,
            stock_volume=stock_daily.trade_volume,
            investment_bank=asset.investment_bank,
            dividend=dividend.dividend,
            purchase_price=purchase_price,
            purchase_amount=purchase_price * asset.quantity,
        )

        total_asset_amount += current_stock_daily.adj_close_price * asset.quantity
        total_invest_amount += stock_daily.adj_close_price * asset.quantity
        total_dividend_amount += dividend.dividend * 1350  # 환율 데이터 수집 후 수정하겠습니다.

        stock_assets.append(stock_asset)

    result = StockAssetResponse(
        stock_assets=stock_assets,
        total_asset_amount=total_asset_amount,
        total_asset_growth_rate=total_asset_growth_rate,
        total_invest_amount=total_invest_amount,
        total_invest_growth_rate=total_invest_growth_rate,
        total_profit_amount=total_profit_amount,
        total_profit_rate=total_profit_rate,
        total_dividend_amount=total_dividend_amount,
        total_dividend_rate=total_dividend_rate,
    )

    await redis_stock_repository.save_dummy_asset(result)

    return result


@asset_router.get("/asset", summary="사용자의 자산 정보를 반환합니다.", response_model=list[AssetTransaction])
async def get_assets(
    token: dict = Depends(verify_jwt_token), db: AsyncSession = Depends(get_mysql_session)
) -> list[AssetTransaction]:
    user_id = token.get("sub")
    if user_id is None:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자 id를 찾지 못하였습니다.")

    try:
        result = await AssetRepository.get_assets(db, user_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자의 자산관리 정보를 찾지 못하였습니다.")
    else:
        return result


@asset_router.post("/asset", summary="자산관리 정보를 등록합니다.", response_model=JsonResponse)
async def save_assets(
    transaction_data: AssetTransactionRequest,
    token: dict = Depends(verify_jwt_token),
    db: AsyncSession = Depends(get_mysql_session),
) -> JsonResponse:
    try:
        await AssetRepository.save_assets(db, transaction_data.transactions)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="자산 정보를 저장하는데 실패하였습니다.")
    else:
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"detail": "자산 정보가 성공적으로 저장되었습니다."})


@asset_router.put("/asset", summary="자산관리 정보를 수정합니다.", response_model=JsonResponse)
async def update_assets(
    transaction_data: AssetTransactionRequest,
    token: dict = Depends(verify_jwt_token),
    db: AsyncSession = Depends(get_mysql_session),
) -> JsonResponse:
    try:
        await AssetRepository.update_assets(db, transaction_data.transactions)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 자산관리 정보를 찾지 못하였습니다.")
    else:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={"detail": "자산 정보가 성공적으로 수정 되었습니다."})
