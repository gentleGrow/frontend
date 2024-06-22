from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.common.schema import JsonResponse
from app.module.asset.enum import AssetType
from app.module.asset.model import Asset, AssetStock, Dividend, Stock, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.schema.asset_schema import AssetTransaction, AssetTransactionRequest
from app.module.asset.schema.stock_schema import StockAsset, StockAssetResponse
from app.module.auth.constant import DUMMY_USER_ID
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.dependency import get_mysql_session
from database.singleton import redis_stock_repository

asset_router = APIRouter(prefix="/v1")


@asset_router.get("/dummy/asset", summary="임시 자산 정보를 반환합니다.", response_model=StockAssetResponse)
async def get_dummy_assets(session: AsyncSession = Depends(get_mysql_session)) -> StockAssetResponse:
    dummy_asset_cache = await redis_stock_repository.get_dummy_asset()
    if dummy_asset_cache:
        return dummy_asset_cache

    dummy_assets: list[Asset] = await AssetRepository.get_by_asset_type_eager(session, DUMMY_USER_ID, AssetType.STOCK)

    asset_stocks: list[AssetStock] = []
    stocks: list[Stock] = []
    stock_codes = []

    for asset in dummy_assets:
        for asset_stock in asset.asset_stock:
            asset_stocks.append(asset_stock)
            stocks.append(asset_stock.stock)
            stock_codes.append(asset_stock.stock.code)

    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies(session, stock_codes)
    dividends: list[Dividend] = await DividendRepository.get_dividends(session, stock_codes)

    stock_map = {stock.id: stock for stock in stocks}
    stock_daily_map = {daily.code: daily for daily in stock_dailies}
    dividend_map = {dividend.stock_code: dividend for dividend in dividends}
    current_stock_daily_map: dict[str, StockDaily] = {}
    for daily in stock_dailies:
        if daily.code not in current_stock_daily_map or daily.date > current_stock_daily_map[daily.code].date:
            current_stock_daily_map[daily.code] = daily

    stock_assets = []
    total_asset_amount = 0
    total_invest_amount = 0
    total_profit_amount = 0
    total_dividend_amount = 0

    for asset in dummy_assets:
        asset_stock = next((a for a in asset_stocks if a.asset_id == asset.id))
        if asset_stock is None:
            continue

        stock = stock_map.get(asset_stock.stock_id)
        if stock is None:
            continue

        stock_daily = stock_daily_map.get(stock.code)
        dividend = dividend_map.get(stock.code)
        current_stock_daily = current_stock_daily_map.get(stock.code)

        if stock_daily is None or current_stock_daily is None or dividend is None:
            continue

        purchase_price = (
            asset_stock.purchase_price if asset_stock.purchase_price is not None else stock_daily.adj_close_price
        )
        profit = (current_stock_daily.adj_close_price / stock_daily.adj_close_price - 1) * 100

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
        total_asset_growth_rate=0,  # %는 데이터 수집이 안정화 된 후 진행 하겠습니다.
        total_invest_amount=total_invest_amount,
        total_invest_growth_rate=0,  # %는 데이터 수집이 안정화 된 후 진행 하겠습니다.
        total_profit_amount=total_profit_amount,
        total_profit_rate=0,  # %는 데이터 수집이 안정화 된 후 진행 하겠습니다.
        total_dividend_amount=total_dividend_amount,
        total_dividend_rate=0,  # %는 데이터 수집이 안정화 된 후 진행 하겠습니다.
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
