import json
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.auth.security import verify_jwt_token
from app.module.asset.enum import AssetType, MarketIndex
from app.module.asset.model import Asset, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.schema import MarketIndexData
from app.module.asset.service import (
    check_not_found_stock,
    get_current_stock_price,
    get_exchange_rate_map,
    get_total_asset_amount,
    get_total_investment_amount,
)
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.asset.services.stock_service import StockService
from app.module.auth.constant import DUMMY_USER_ID
from app.module.auth.schema import AccessToken
from app.module.chart.constant import TIP_TODAY_ID_REDIS_KEY
from app.module.chart.enum import CompositionType
from app.module.chart.redis_repository import RedisMarketIndiceRepository, RedisTipRepository
from app.module.chart.repository import TipRepository
from app.module.chart.schema import (
    ChartTipResponse,
    CompositionResponse,
    CompositionResponseValue,
    MarketIndiceResponse,
    MarketIndiceResponseValue,
    SummaryResponse,
)
from app.module.chart.service.composition_service import CompositionService
from database.dependency import get_mysql_session_router, get_redis_pool

chart_router = APIRouter(prefix="/v1")


@chart_router.get("/composition", summary="종목 구성", response_model=CompositionResponse)
async def get_composition(
    token: AccessToken = Depends(verify_jwt_token),
    type: CompositionType = Query(CompositionType.COMPOSITION, description="composition은 종목 별, account는 계좌 별 입니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> CompositionResponse:
    user_id = token.get("user")
    if user_id is None:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자 id를 찾지 못하였습니다.")

    assets: list[Asset] = await AssetRepository.get_eager(session, user_id, AssetType.STOCK)
    if len(assets) == 0:
        return CompositionResponse(
            composition=[CompositionResponseValue(name="자산 없음", percent_rate=0.0, current_amount=0.0)]
        )

    stock_codes = [asset.asset_stock.stock.code for asset in assets]
    lastest_stock_dailies: list[StockDaily] = await StockDailyRepository.get_latest(session, stock_codes)
    lastest_stock_daily_map = {daily.code: daily for daily in lastest_stock_dailies}
    current_stock_price_map = await StockService.get_current_stock_price(
        redis_client, lastest_stock_daily_map, stock_codes
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

    if type is CompositionType.COMPOSITION:
        stock_composition_data = CompositionService.get_asset_stock_composition(
            assets, current_stock_price_map, exchange_rate_map
        )

        composition_data = [
            CompositionResponseValue(
                name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
            )
            for item in stock_composition_data
        ]

        return CompositionResponse(composition=composition_data)
    else:
        account_composition_data = CompositionService.get_asset_stock_account(
            assets, current_stock_price_map, exchange_rate_map
        )

        composition_data = [
            CompositionResponseValue(
                name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
            )
            for item in account_composition_data
        ]

        return CompositionResponse(composition=composition_data)


@chart_router.get("/dummy/composition", summary="종목 구성", response_model=CompositionResponse)
async def get_dummy_composition(
    type: CompositionType = Query(CompositionType.COMPOSITION, description="composition은 종목 별, account는 계좌 별 입니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> CompositionResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    if len(assets) == 0:
        return CompositionResponse(
            composition=[CompositionResponseValue(name="자산 없음", percent_rate=0.0, current_amount=0.0)]
        )

    stock_codes = [asset.asset_stock.stock.code for asset in assets]
    lastest_stock_dailies: list[StockDaily] = await StockDailyRepository.get_latest(session, stock_codes)
    lastest_stock_daily_map = {daily.code: daily for daily in lastest_stock_dailies}
    current_stock_price_map = await StockService.get_current_stock_price(
        redis_client, lastest_stock_daily_map, stock_codes
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

    if type is CompositionType.COMPOSITION:
        stock_composition_data = CompositionService.get_asset_stock_composition(
            assets, current_stock_price_map, exchange_rate_map
        )

        composition_data = [
            CompositionResponseValue(
                name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
            )
            for item in stock_composition_data
        ]

        return CompositionResponse(composition=composition_data)
    else:
        account_composition_data = CompositionService.get_asset_stock_account(
            assets, current_stock_price_map, exchange_rate_map
        )

        composition_data = [
            CompositionResponseValue(
                name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
            )
            for item in account_composition_data
        ]

        return CompositionResponse(composition=composition_data)


@chart_router.get("/indice", summary="현재 시장 지수", response_model=MarketIndiceResponse)
async def get_market_index(
    market_indices: list[MarketIndex] = Query(..., description="KS11, KQ11, DJI, GSPC, IXIC 등등 대표적인 지수 명을 입력 해주세요."),
    redis_client: Redis = Depends(get_redis_pool),
) -> MarketIndiceResponse:
    market_index_keys = [index.value for index in market_indices]
    market_index_values_str = await RedisMarketIndiceRepository.gets(redis_client, market_index_keys)

    market_index_values: list[MarketIndexData] = [
        MarketIndexData(**json.loads(value)) if value is not None else None for value in market_index_values_str
    ]

    missing_indices = [
        market_index_keys[i] for i, market_index_value in enumerate(market_index_values) if market_index_value is None
    ]
    if missing_indices:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{', '.join(missing_indices)}의 값이 없습니다.")

    market_index_pairs = [
        MarketIndiceResponseValue(
            index_name=market_index_value.index_name,
            current_value=float(market_index_value.current_value),
            change_percent=float(market_index_value.change_percent)
        )
        for market_index_value in market_index_values
        if market_index_value is not None
    ]

    return MarketIndiceResponse(market_indices=market_index_pairs)


@chart_router.get("/summary", summary="오늘의 리뷰, 나의 총자산, 나의 투자 금액, 수익금", response_model=SummaryResponse)
async def get_summary(
    token: AccessToken = Depends(verify_jwt_token),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> SummaryResponse:
    user_id = token.get("user")
    if user_id is None:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자 id를 찾지 못하였습니다.")

    assets: list[Asset] = await AssetRepository.get_eager(session, int(user_id), AssetType.STOCK)
    if len(assets) == 0:
        return SummaryResponse(
            today_review_rate=0.0, total_asset_amount=0, total_investment_amount=0, profit_amount=0, profit_rate=0.0
        )

    stock_code_date_pairs = [(asset.asset_stock.stock.code, asset.asset_stock.purchase_date) for asset in assets]
    stock_codes = [asset.asset_stock.stock.code for asset in assets]
    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies_by_code_and_date(
        session, stock_code_date_pairs
    )
    exchange_rate_map = await get_exchange_rate_map(redis_client)
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    current_stock_price_map = await get_current_stock_price(redis_client, stock_daily_map, stock_codes)

    not_found_stock_codes: list[str] = check_not_found_stock(stock_daily_map, current_stock_price_map, assets)
    if not_found_stock_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail={"not_found_stock_codes": not_found_stock_codes}
        )

    total_asset_amount = get_total_asset_amount(assets, current_stock_price_map, exchange_rate_map)
    total_investment_amount = get_total_investment_amount(assets, stock_daily_map, exchange_rate_map)

    profit_amount = total_asset_amount - total_investment_amount
    profit_rate = (total_asset_amount - total_investment_amount) / total_asset_amount * 100

    thirty_days_ago = datetime.now().date() - timedelta(days=30)
    assets_30days = [asset for asset in assets if asset.asset_stock.purchase_date <= thirty_days_ago]

    if len(assets_30days) == 0:
        today_review_rate = 100.0
    else:
        total_asset_amount_30days = get_total_asset_amount(assets_30days, current_stock_price_map, exchange_rate_map)
        today_review_rate = (total_asset_amount - total_asset_amount_30days) / total_asset_amount * 100

    return SummaryResponse(
        today_review_rate=today_review_rate,
        total_asset_amount=int(total_asset_amount),
        total_investment_amount=int(total_investment_amount),
        profit_amount=int(profit_amount),
        profit_rate=profit_rate,
    )


@chart_router.get("/dummy/summary", summary="오늘의 리뷰, 나의 총자산, 나의 투자 금액, 수익금", response_model=SummaryResponse)
async def get_dummy_summary(
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> SummaryResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    if len(assets) == 0:
        return SummaryResponse(
            today_review_rate=0.0, total_asset_amount=0, total_investment_amount=0, profit_amount=0, profit_rate=0.0
        )

    stock_code_date_pairs = [(asset.asset_stock.stock.code, asset.asset_stock.purchase_date) for asset in assets]
    stock_codes = [asset.asset_stock.stock.code for asset in assets]
    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies_by_code_and_date(
        session, stock_code_date_pairs
    )
    exchange_rate_map = await get_exchange_rate_map(redis_client)
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    current_stock_price_map = await get_current_stock_price(redis_client, stock_daily_map, stock_codes)

    not_found_stock_codes: list[str] = check_not_found_stock(stock_daily_map, current_stock_price_map, assets)
    if not_found_stock_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail={"not_found_stock_codes": not_found_stock_codes}
        )

    total_asset_amount = get_total_asset_amount(assets, current_stock_price_map, exchange_rate_map)
    total_investment_amount = get_total_investment_amount(assets, stock_daily_map, exchange_rate_map)

    profit_amount = total_asset_amount - total_investment_amount
    profit_rate = (total_asset_amount - total_investment_amount) / total_asset_amount * 100

    thirty_days_ago = datetime.now().date() - timedelta(days=30)
    assets_30days = [asset for asset in assets if asset.asset_stock.purchase_date <= thirty_days_ago]

    if len(assets_30days) == 0:
        today_review_rate = 100.0
    else:
        total_asset_amount_30days = get_total_asset_amount(assets_30days, current_stock_price_map, exchange_rate_map)
        today_review_rate = (total_asset_amount - total_asset_amount_30days) / total_asset_amount * 100

    return SummaryResponse(
        today_review_rate=today_review_rate,
        total_asset_amount=int(total_asset_amount),
        total_investment_amount=int(total_investment_amount),
        profit_amount=int(profit_amount),
        profit_rate=profit_rate,
    )


@chart_router.get("/tip", summary="오늘의 투자 tip", response_model=ChartTipResponse)
async def get_today_tip(
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> ChartTipResponse:
    today_tip_id = await RedisTipRepository.get(redis_client, TIP_TODAY_ID_REDIS_KEY)

    if today_tip_id is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="오늘의 팁 id가 캐싱되어 있지 않습니다.")

    invest_tip = await TipRepository.get(session, int(today_tip_id))

    if invest_tip is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="오늘의 팁 데이터가 존재하지 않습니다.")

    return ChartTipResponse(today_tip=invest_tip.tip)
