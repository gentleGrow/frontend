from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from pydantic import StrictBool
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.common.schema.json_schema import JsonResponse
from app.module.asset.constant import DUMMY_ASSET_EXPIRE_SECOND, DUMMY_ASSET_KOREA_KEY, DUMMY_ASSET_OTHER_KEY
from app.module.asset.enum import AssetType
from app.module.asset.model import Asset, Dividend, ExchangeRate, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.repository.exchange_rate_repository import ExchangeRateRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.schema.asset_schema import AssetTransaction, AssetTransactionRequest
from app.module.asset.schema.stock_schema import StockAssetResponse
from app.module.asset.service import check_not_found_stock, get_stock_mapping_info, get_total_asset_data
from app.module.auth.constant import DUMMY_USER_ID
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from database.dependency import get_mysql_session_router
from database.redis import redis_repository

asset_router = APIRouter(prefix="/v1")


@asset_router.get("/dummy/asset", summary="임시 자산 정보를 반환합니다.", response_model=StockAssetResponse)
async def get_dummy_assets(
    session: AsyncSession = Depends(get_mysql_session_router),
    base_currency: StrictBool = Query(..., description="원화는 True, 종목통화는 False"),
) -> StockAssetResponse:
    if base_currency not in [True, False]:
        raise HTTPException(status_code=400, detail="올바른 parameter가 넘어 오지 않았습니다. 원화는 True, 종목통화는 False")

    if base_currency:
        dummy_asset_cache_key = DUMMY_ASSET_KOREA_KEY
    else:
        dummy_asset_cache_key = DUMMY_ASSET_OTHER_KEY

    dummy_asset_cache: StockAssetResponse | None = await redis_repository.get(dummy_asset_cache_key)
    if dummy_asset_cache:
        return StockAssetResponse.model_validate_json(dummy_asset_cache)

    dummy_assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    stock_codes = [asset.asset_stock.stock.code for asset in dummy_assets]
    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies(session, stock_codes)
    dividends: list[Dividend] = await DividendRepository.get_dividends(session, stock_codes)
    exchange_rates: list[ExchangeRate] = await ExchangeRateRepository.get_exchange_rates(session)

    stock_daily_map, dividend_map, current_stock_daily_map = get_stock_mapping_info(stock_dailies, dividends)

    not_found_stock_codes: list[str] = check_not_found_stock(stock_daily_map, current_stock_daily_map, dummy_assets)
    if not_found_stock_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail={"not_found_stock_codes": not_found_stock_codes}
        )

    (
        stock_assets,
        total_asset_amount,
        total_invest_amount,
        total_invest_growth_rate,
        total_dividend_amount,
    ) = get_total_asset_data(
        dummy_assets, stock_daily_map, current_stock_daily_map, dividend_map, exchange_rates, base_currency
    )

    result: StockAssetResponse = StockAssetResponse.parse(
        stock_assets, total_asset_amount, total_invest_amount, total_invest_growth_rate, total_dividend_amount
    )

    await redis_repository.save(dummy_asset_cache_key, result.model_dump_json(), DUMMY_ASSET_EXPIRE_SECOND)

    return result


@asset_router.get("/asset", summary="사용자의 자산 정보를 반환합니다.", response_model=list[AssetTransaction])
async def get_assets(
    token: dict = Depends(verify_jwt_token), db: AsyncSession = Depends(get_mysql_session_router)
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
    db: AsyncSession = Depends(get_mysql_session_router),
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
    db: AsyncSession = Depends(get_mysql_session_router),
) -> JsonResponse:
    try:
        await AssetRepository.update_assets(db, transaction_data.transactions)
    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 자산관리 정보를 찾지 못하였습니다.")
    else:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={"detail": "자산 정보가 성공적으로 수정 되었습니다."})
