import json
from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from icecream import ic
from app.common.auth.security import verify_jwt_token
from app.data.investing.sources.enum import RicePeople
from app.module.asset.constant import MARKET_INDEX_KR_MAPPING
from app.module.asset.enum import AssetType, CurrencyType, MarketIndex
from app.module.asset.model import Asset, Dividend, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.schema import MarketIndexData
from app.module.asset.services.asset_stock_service import AssetStockService
from app.module.asset.services.dividend_service import DividendService
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.asset.services.stock_daily_service import StockDailyService
from app.module.asset.services.stock_service import StockService
from app.module.auth.constant import DUMMY_USER_ID
from app.module.auth.repository import UserRepository
from app.module.auth.schema import AccessToken
from app.module.chart.constant import (
    DEFAULT_TIP,
    REDIS_RICH_PICK_KEY,
    REDIS_RICH_PICK_NAME_KEY,
    RICH_PICK_SECOND,
    TIP_TODAY_ID_REDIS_KEY,
)
from app.module.chart.enum import CompositionType, EstimateDividendType, IntervalType
from app.module.chart.facade.composition_facade import CompositionFacade
from app.module.chart.facade.dividend_facade import DividendFacade
from app.module.chart.facade.performance_analysis_facade import PerformanceAnalysisFacade
from app.module.chart.redis_repository import RedisMarketIndiceRepository, RedisRichPickRepository, RedisTipRepository
from app.module.chart.repository import TipRepository
from app.module.chart.schema import (
    ChartTipResponse,
    CompositionResponse,
    CompositionResponseValue,
    EstimateDividendEveryResponse,
    EstimateDividendTypeResponse,
    EstimateDividendTypeValue,
    MarketIndiceResponse,
    MarketIndiceResponseValue,
    MyStockResponse,
    MyStockResponseValue,
    PerformanceAnalysisResponse,
    ProfitDetail,
    RichPickResponse,
    RichPickValue,
    RichPortfolioResponse,
    RichPortfolioValue,
    SummaryResponse,
)
from app.module.chart.service.rich_portfolio_service import RichPortfolioService
from app.module.chart.service.summary_service import SummaryService
from database.dependency import get_mysql_session_router, get_redis_pool

chart_router = APIRouter(prefix="/v1")


@chart_router.get("/rich-portfolio", summary="부자들의 포트폴리오", response_model=RichPortfolioResponse)
async def get_rich_portfolio(redis_client: Redis = Depends(get_redis_pool)) -> RichPortfolioResponse:
    rich_portfolio_map: dict = await RichPortfolioService.get_rich_porfolio_map(redis_client)

    return RichPortfolioResponse(
        [RichPortfolioValue(name=person, stock=portfolio) for person, portfolio in rich_portfolio_map.items()]
    )


@chart_router.get(
    "/sample/estimate-dividend",
    summary="더미 예상 배당액",
    response_model=EstimateDividendEveryResponse | EstimateDividendTypeResponse,
)
async def get_sample_estimate_dividend(
    category: EstimateDividendType = Query(EstimateDividendType.EVERY, description="every는 모두, type은 종목 별 입니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> EstimateDividendEveryResponse | EstimateDividendTypeResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    if len(assets) == 0:
        return (
            EstimateDividendEveryResponse({})
            if category == EstimateDividendType.EVERY
            else EstimateDividendTypeResponse([])
        )

    exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)
    dividend_map: dict[tuple[str, date], float] = await DividendService.get_dividend_map(session, assets)
    recent_dividend_map: dict[str, float] = await DividendService.get_recent_map(session, assets)

    if category == EstimateDividendType.EVERY:
        total_dividends: dict[date, float] = DividendFacade.get_full_month_estimate_dividend(
            assets, exchange_rate_map, dividend_map
        )
        response_data = DividendService.process_dividends_by_year_month(total_dividends)
        return EstimateDividendEveryResponse(response_data)
    else:
        total_type_dividends: list[tuple[str, float, float]] = await DividendFacade.get_composition(
            assets, exchange_rate_map, recent_dividend_map
        )

        return EstimateDividendTypeResponse(
            [
                EstimateDividendTypeValue(name=stock_code, current_amount=amount, percent_rate=composition_rate)
                for stock_code, amount, composition_rate in total_type_dividends
            ]
        )


@chart_router.get(
    "/estimate-dividend", summary="예상 배당액", response_model=EstimateDividendEveryResponse | EstimateDividendTypeResponse
)
async def get_estimate_dividend(
    token: AccessToken = Depends(verify_jwt_token),
    category: EstimateDividendType = Query(EstimateDividendType.EVERY, description="every는 모두, type은 종목 별 입니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> EstimateDividendEveryResponse | EstimateDividendTypeResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, int(token.get("user")), AssetType.STOCK)
    if len(assets) == 0:
        return (
            EstimateDividendEveryResponse({})
            if category == EstimateDividendType.EVERY
            else EstimateDividendTypeResponse([])
        )

    exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)
    dividend_map: dict[tuple[str, date], float] = await DividendService.get_dividend_map(session, assets)
    recent_dividend_map: dict[str, float] = await DividendService.get_recent_map(session, assets)

    if category == EstimateDividendType.EVERY:
        total_dividends: dict[date, float] = DividendFacade.get_full_month_estimate_dividend(
            assets, exchange_rate_map, dividend_map
        )
        response_data = DividendService.process_dividends_by_year_month(total_dividends)
        return EstimateDividendEveryResponse(response_data)
    else:
        total_type_dividends: list[tuple[str, float, float]] = await DividendFacade.get_composition(
            assets, exchange_rate_map, recent_dividend_map
        )

        return EstimateDividendTypeResponse(
            [
                EstimateDividendTypeValue(name=stock_code, current_amount=amount, percent_rate=composition_rate)
                for stock_code, amount, composition_rate in total_type_dividends
            ]
        )


@chart_router.get("/sample/performance-analysis", summary="더미 투자 성과 분석", response_model=PerformanceAnalysisResponse)
async def get_sample_performance_analysis(
    interval: IntervalType = Query(IntervalType.ONEMONTH, description="기간 별, 투자 성관 분석 데이터가 제공 됩니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> PerformanceAnalysisResponse:
    if interval is IntervalType.ONEMONTH:
        start_date, end_date = interval.get_start_end_time()
        market_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_market_analysis(
            session, redis_client, start_date, end_date
        )
        user_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_user_analysis(
            session, redis_client, start_date, end_date, DUMMY_USER_ID, market_analysis_result
        )
        sorted_dates = sorted(market_analysis_result.keys())

        return PerformanceAnalysisResponse(
            xAxises=[date.strftime("%m.%d") for date in sorted_dates],
            dates=[date.strftime("%Y.%m.%d") for date in sorted_dates],
            values1={"values": [user_analysis_result[date] for date in sorted_dates], "name": "내 수익률"},
            values2={"values": [market_analysis_result[date] for date in sorted_dates], "name": "코스피"},
            unit="%",
        )
    elif interval in IntervalType.FIVEDAY:
        start_datetime, end_datetime = interval.get_start_end_time()

        market_analysis_result_short: dict[datetime, float] = await PerformanceAnalysisFacade.get_market_analysis_short(
            session, redis_client, start_datetime, end_datetime, interval
        )
        user_analysis_result_short: dict[datetime, float] = await PerformanceAnalysisFacade.get_user_analysis_short(
            session,
            redis_client,
            start_datetime,
            end_datetime,
            DUMMY_USER_ID,
            interval,
            market_analysis_result_short,
        )

        sorted_datetimes = sorted(market_analysis_result_short.keys())

        return PerformanceAnalysisResponse(
            xAxises=[datetime.strftime("%m.%d") for datetime in sorted_datetimes],
            dates=[datetime.strftime("%Y.%m.%d %H:%M") for datetime in sorted_datetimes],
            values1={
                "values": [user_analysis_result_short[datetime] for datetime in sorted_datetimes],
                "name": "내 수익률",
            },
            values2={
                "values": [market_analysis_result_short[datetime] for datetime in sorted_datetimes],
                "name": "코스피",
            },
            unit="%",
        )
    else:
        start_date, end_date = interval.get_start_end_time()
        market_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_market_analysis(
            session, redis_client, start_date, end_date
        )
        user_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_user_analysis(
            session, redis_client, start_date, end_date, DUMMY_USER_ID, market_analysis_result
        )

        return PerformanceAnalysisResponse.get_performance_analysis_response(
            market_analysis_result, user_analysis_result
        )


@chart_router.get("/performance-analysis", summary="투자 성과 분석", response_model=PerformanceAnalysisResponse)
async def get_performance_analysis(
    token: AccessToken = Depends(verify_jwt_token),
    interval: IntervalType = Query(IntervalType.ONEMONTH, description="기간 별, 투자 성관 분석 데이터가 제공 됩니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> PerformanceAnalysisResponse:
    if interval is IntervalType.ONEMONTH:
        start_date, end_date = interval.get_start_end_time()
        market_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_market_analysis(
            session, redis_client, start_date, end_date
        )
        user_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_user_analysis(
            session, redis_client, start_date, end_date, token.get("user"), market_analysis_result
        )
        sorted_dates = sorted(market_analysis_result.keys())

        return PerformanceAnalysisResponse(
            xAxises=[date.strftime("%m.%d") for date in sorted_dates],
            dates=[date.strftime("%Y.%m.%d") for date in sorted_dates],
            values1={"values": [user_analysis_result[date] for date in sorted_dates], "name": "내 수익률"},
            values2={"values": [market_analysis_result[date] for date in sorted_dates], "name": "코스피"},
            unit="%",
        )
    elif interval in IntervalType.FIVEDAY:
        start_datetime, end_datetime = interval.get_start_end_time()

        market_analysis_result_short: dict[datetime, float] = await PerformanceAnalysisFacade.get_market_analysis_short(
            session, redis_client, start_datetime, end_datetime, interval
        )
        user_analysis_result_short: dict[datetime, float] = await PerformanceAnalysisFacade.get_user_analysis_short(
            session,
            redis_client,
            start_datetime,
            end_datetime,
            token.get("user"),
            interval,
            market_analysis_result_short,
        )

        sorted_datetimes = sorted(market_analysis_result_short.keys())

        return PerformanceAnalysisResponse(
            xAxises=[datetime.strftime("%m.%d") for datetime in sorted_datetimes],
            dates=[datetime.strftime("%Y.%m.%d %H:%M") for datetime in sorted_datetimes],
            values1={
                "values": [user_analysis_result_short[datetime] for datetime in sorted_datetimes],
                "name": "내 수익률",
            },
            values2={
                "values": [market_analysis_result_short[datetime] for datetime in sorted_datetimes],
                "name": "코스피",
            },
            unit="%",
        )
    else:
        start_date, end_date = interval.get_start_end_time()
        market_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_market_analysis(
            session, redis_client, start_date, end_date
        )
        user_analysis_result: dict[date, float] = await PerformanceAnalysisFacade.get_user_analysis(
            session, redis_client, start_date, end_date, token.get("user"), market_analysis_result
        )

        return PerformanceAnalysisResponse.get_performance_analysis_response(
            market_analysis_result, user_analysis_result
        )


@chart_router.get("/sample/composition", summary="종목 구성", response_model=CompositionResponse)
async def get_sample_composition(
    type: CompositionType = Query(CompositionType.COMPOSITION, description="composition은 종목 별, account는 계좌 별 입니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> CompositionResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    if len(assets) == 0:
        return CompositionResponse(
            composition=[CompositionResponseValue(name="자산 없음", percent_rate=0.0, current_amount=0.0)]
        )

    lastest_stock_daily_map = await StockDailyService.get_latest_map(session, assets)
    current_stock_price_map = await StockService.get_current_stock_price_by_code(
        redis_client, lastest_stock_daily_map, [asset.asset_stock.stock.code for asset in assets]
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

    if type is CompositionType.COMPOSITION:
        stock_composition_data = CompositionFacade.get_asset_stock_composition(
            assets, current_stock_price_map, exchange_rate_map
        )
        return CompositionResponse(
            [
                CompositionResponseValue(
                    name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
                )
                for item in stock_composition_data
            ]
        )
    else:
        account_composition_data = CompositionFacade.get_asset_stock_account(
            assets, current_stock_price_map, exchange_rate_map
        )

        return CompositionResponse(
            [
                CompositionResponseValue(
                    name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
                )
                for item in account_composition_data
            ]
        )


@chart_router.get("/composition", summary="종목 구성", response_model=CompositionResponse)
async def get_composition(
    token: AccessToken = Depends(verify_jwt_token),
    type: CompositionType = Query(CompositionType.COMPOSITION, description="composition은 종목 별, account는 계좌 별 입니다."),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> CompositionResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, token.get("user"), AssetType.STOCK)
    if len(assets) == 0:
        return CompositionResponse(
            composition=[CompositionResponseValue(name="자산 없음", percent_rate=0.0, current_amount=0.0)]
        )

    lastest_stock_daily_map = await StockDailyService.get_latest_map(session, assets)
    current_stock_price_map = await StockService.get_current_stock_price_by_code(
        redis_client, lastest_stock_daily_map, [asset.asset_stock.stock.code for asset in assets]
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

    if type is CompositionType.COMPOSITION:
        stock_composition_data = CompositionFacade.get_asset_stock_composition(
            assets, current_stock_price_map, exchange_rate_map
        )
        return CompositionResponse(
            [
                CompositionResponseValue(
                    name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
                )
                for item in stock_composition_data
            ]
        )
    else:
        account_composition_data = CompositionFacade.get_asset_stock_account(
            assets, current_stock_price_map, exchange_rate_map
        )

        return CompositionResponse(
            [
                CompositionResponseValue(
                    name=item["name"], percent_rate=item["percent_rate"], current_amount=item["current_amount"]
                )
                for item in account_composition_data
            ]
        )


#########################################################################################################################################


@chart_router.get("/my-stock", summary="내 보유 주식", response_model=MyStockResponse)
async def get_my_stock(
    token: AccessToken = Depends(verify_jwt_token),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> MyStockResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, token.get("user"), AssetType.STOCK)
    if len(assets) == 0:
        return MyStockResponse(my_stock_list=[])

    stock_codes = [asset.asset_stock.stock.code for asset in assets]

    stock_code_date_pairs = [(asset.asset_stock.stock.code, asset.asset_stock.purchase_date) for asset in assets]
    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies_by_code_and_date(
        session, stock_code_date_pairs
    )
    dividends: list[Dividend] = await DividendRepository.get_dividends_recent(session, stock_codes)

    dividend_map = {dividend.stock_code: dividend.dividend for dividend in dividends}
    lastest_stock_dailies: list[StockDaily] = await StockDailyRepository.get_latest(session, stock_codes)
    lastest_stock_daily_map = {daily.code: daily for daily in lastest_stock_dailies}
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    current_stock_price_map = await StockService.get_current_stock_price(
        redis_client, lastest_stock_daily_map, stock_codes
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

    stock_assets: list[dict] = await AssetStockService.get_stock_assets(
        session, token.get("user"), assets, stock_daily_map, current_stock_price_map, dividend_map, exchange_rate_map
    )

    my_stock_list = [
        MyStockResponseValue(
            name=stock_asset["stock_name"],
            current_price=stock_asset["current_price"],
            profit_rate=stock_asset["profit_rate"],
            profit_amount=stock_asset["profit_amount"],
            quantity=stock_asset["quantity"],
        )
        for stock_asset in stock_assets
    ]

    return MyStockResponse(my_stock_list=my_stock_list)


@chart_router.get("/sample/my-stock", summary="내 보유 주식", response_model=MyStockResponse)
async def get_sample_my_stock(
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> MyStockResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    if len(assets) == 0:
        return MyStockResponse(my_stock_list=[])

    stock_codes = [asset.asset_stock.stock.code for asset in assets]

    stock_code_date_pairs = [(asset.asset_stock.stock.code, asset.asset_stock.purchase_date) for asset in assets]
    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies_by_code_and_date(
        session, stock_code_date_pairs
    )
    dividends: list[Dividend] = await DividendRepository.get_dividends_recent(session, stock_codes)

    dividend_map = {dividend.stock_code: dividend.dividend for dividend in dividends}
    lastest_stock_dailies: list[StockDaily] = await StockDailyRepository.get_latest(session, stock_codes)
    lastest_stock_daily_map = {daily.code: daily for daily in lastest_stock_dailies}
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    current_stock_price_map = await StockService.get_current_stock_price_by_code(
        redis_client, lastest_stock_daily_map, stock_codes
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

    stock_assets: list[dict] = await AssetStockService.get_stock_assets(
        session, DUMMY_USER_ID, assets, stock_daily_map, current_stock_price_map, dividend_map, exchange_rate_map
    )

    my_stock_list = [
        MyStockResponseValue(
            name=stock_asset["stock_name"],
            current_price=stock_asset["current_price"],
            profit_rate=stock_asset["profit_rate"],
            profit_amount=stock_asset["profit_amount"],
            quantity=stock_asset["quantity"],
        )
        for stock_asset in stock_assets
    ]

    return MyStockResponse(my_stock_list=my_stock_list)


@chart_router.get("/summary", summary="오늘의 리뷰, 나의 총자산, 나의 투자 금액, 수익금", response_model=SummaryResponse)
async def get_summary(
    token: AccessToken = Depends(verify_jwt_token),
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> SummaryResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, token.get("user"), AssetType.STOCK)
    if len(assets) == 0:
        return SummaryResponse(
            today_review_rate=0.0, total_asset_amount=0, total_investment_amount=0, profit_amount=0, profit_rate=0.0
        )

    stock_daily_map: dict[tuple[str, date], StockDaily] = await StockDailyService.get_map_range(session, assets)
    latest_stock_daily_map: dict[str, StockDaily] = await StockDailyService.get_latest_map(session, assets)
    current_stock_price_map: dict[str, float] = await StockService.get_current_stock_price_by_code(
        redis_client, latest_stock_daily_map, [asset.asset_stock.stock.code for asset in assets]
    )
    exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)

    not_found_stock_codes: list[str] = StockService.check_not_found_stock(
        stock_daily_map, current_stock_price_map, assets
    )
    if not_found_stock_codes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"다음의 주식 코드를 찾지 못 했습니다.": not_found_stock_codes}
        )

    total_asset_amount: float = AssetStockService.get_total_asset_amount(
        assets, current_stock_price_map, exchange_rate_map
    )
    total_investment_amount: float = AssetStockService.get_total_investment_amount(
        assets, stock_daily_map, exchange_rate_map
    )
    today_review_rate: float = SummaryService.get_today_review_rate(
        assets, total_asset_amount, current_stock_price_map, exchange_rate_map
    )

    return SummaryResponse(
        today_review_rate=today_review_rate,
        total_asset_amount=total_asset_amount,
        total_investment_amount=total_investment_amount,
        profit=ProfitDetail(
            profit_amount=total_asset_amount - total_investment_amount,
            profit_rate=(total_asset_amount - total_investment_amount) / total_asset_amount * 100
            if total_investment_amount > 0.0 and total_asset_amount > 0.0
            else 0.0,
        ),
    )


@chart_router.get("/sample/summary", summary="오늘의 리뷰, 나의 총자산, 나의 투자 금액, 수익금", response_model=SummaryResponse)
async def get_sample_summary(
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> SummaryResponse:
    assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
    if len(assets) == 0:
        return SummaryResponse(
            today_review_rate=0.0, total_asset_amount=0, total_investment_amount=0, profit_amount=0, profit_rate=0.0
        )

    stock_daily_map: dict[tuple[str, date], StockDaily] = await StockDailyService.get_map_range(session, assets)
    latest_stock_daily_map: dict[str, StockDaily] = await StockDailyService.get_latest_map(session, assets)
    current_stock_price_map: dict[str, float] = await StockService.get_current_stock_price_by_code(
        redis_client, latest_stock_daily_map, [asset.asset_stock.stock.code for asset in assets]
    )
    exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)

    not_found_stock_codes: list[str] = StockService.check_not_found_stock(
        stock_daily_map, current_stock_price_map, assets
    )
    if not_found_stock_codes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"다음의 주식 코드를 찾지 못 했습니다.": not_found_stock_codes}
        )

    total_asset_amount: float = AssetStockService.get_total_asset_amount(
        assets, current_stock_price_map, exchange_rate_map
    )
    total_investment_amount: float = AssetStockService.get_total_investment_amount(
        assets, stock_daily_map, exchange_rate_map
    )
    today_review_rate: float = SummaryService.get_today_review_rate(
        assets, total_asset_amount, current_stock_price_map, exchange_rate_map
    )

    return SummaryResponse(
        today_review_rate=today_review_rate,
        total_asset_amount=total_asset_amount,
        total_investment_amount=total_investment_amount,
        profit=ProfitDetail(
            profit_amount=total_asset_amount - total_investment_amount,
            profit_rate=(total_asset_amount - total_investment_amount) / total_asset_amount * 100
            if total_investment_amount > 0.0 and total_asset_amount > 0.0
            else 0.0,
        ),
    )


@chart_router.get("/tip", summary="오늘의 투자 tip", response_model=ChartTipResponse)
async def get_today_tip(
    session: AsyncSession = Depends(get_mysql_session_router),
    redis_client: Redis = Depends(get_redis_pool),
) -> ChartTipResponse:
    today_tip_id = await RedisTipRepository.get(redis_client, TIP_TODAY_ID_REDIS_KEY)

    if today_tip_id is None:
        return ChartTipResponse(DEFAULT_TIP)

    invest_tip = await TipRepository.get(session, int(today_tip_id))

    if invest_tip is None:
        return ChartTipResponse(DEFAULT_TIP)

    return ChartTipResponse(invest_tip.tip)


@chart_router.get("/indice", summary="현재 시장 지수", response_model=MarketIndiceResponse)
async def get_market_index(
    redis_client: Redis = Depends(get_redis_pool),
) -> MarketIndiceResponse:
    market_index_keys = [market_index.value for market_index in MarketIndex]
    market_index_values_str = await RedisMarketIndiceRepository.gets(redis_client, market_index_keys)

    market_index_values: list[MarketIndexData] = [
        MarketIndexData(**json.loads(value)) if value is not None else None for value in market_index_values_str
    ]

    market_index_pairs = [
        MarketIndiceResponseValue(
            name=market_index_value.name,
            name_kr=MARKET_INDEX_KR_MAPPING.get(market_index_value.name, "N/A"),
            current_value=float(market_index_value.current_value),
            change_percent=float(market_index_value.change_percent),
        )
        for market_index_value in market_index_values
        if market_index_value is not None
    ]

    return MarketIndiceResponse(market_indices=market_index_pairs)


@chart_router.get("/rich-pick", summary="부자들이 선택한 종목 TOP10", response_model=RichPickResponse)
async def get_rich_pick(
    session: AsyncSession = Depends(get_mysql_session_router), redis_client: Redis = Depends(get_redis_pool)
) -> RichPickResponse:
    # [수정]!!!!!!!!! N+1 문제 !!!!!!!!!!!!
    top_10_stocks_raw: str = await RedisRichPickRepository.get(redis_client, REDIS_RICH_PICK_KEY)
    stock_name_map_raw: str = await RedisRichPickRepository.get(redis_client, REDIS_RICH_PICK_NAME_KEY)
    if top_10_stocks_raw is None or stock_name_map_raw is None:
        stock_count = {}
        stock_name_map: dict[str, str] = {}
        for person in RicePeople:
            user = await UserRepository.get_by_name(session, person)
            eager_assets = await AssetRepository.get_eager(session, user.id, AssetType.STOCK)
            for asset in eager_assets:
                stock_code = asset.asset_stock.stock.code
                if stock_code not in stock_count:
                    stock_count[stock_code] = 1
                else:
                    stock_count[stock_code] += 1
                stock_name_map[stock_code] = asset.asset_stock.stock.name
        top_10_stocks: list[str] = [
            stock[0] for stock in sorted(stock_count.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        await RedisRichPickRepository.save(
            redis_client, REDIS_RICH_PICK_KEY, json.dumps(top_10_stocks), RICH_PICK_SECOND
        )
        await RedisRichPickRepository.save(
            redis_client, REDIS_RICH_PICK_NAME_KEY, json.dumps(stock_name_map), RICH_PICK_SECOND
        )
    else:
        # mypy if-else 내부에 중복 네이밍 무시
        top_10_stocks: list[str] = json.loads(top_10_stocks_raw)  # type: ignore
        stock_name_map: dict[str, str] = json.loads(stock_name_map_raw)  # type: ignore

    lastest_stock_dailies: list[StockDaily] = await StockDailyRepository.get_latest(session, top_10_stocks)
    lastest_stock_daily_map = {daily.code: daily for daily in lastest_stock_dailies}
    current_stock_price_map: dict[str, float] = await StockService.get_current_stock_price_by_code(
        redis_client, lastest_stock_daily_map, top_10_stocks
    )
    exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)
    stock_daily_profit: dict[str, float] = StockService.get_daily_profit(
        lastest_stock_daily_map, current_stock_price_map, top_10_stocks
    )
    won_exchange_rate = ExchangeRateService.get_exchange_rate(CurrencyType.USA, CurrencyType.KOREA, exchange_rate_map)

    stock_korea_price = {stock_code: price * won_exchange_rate for stock_code, price in current_stock_price_map.items()}

    response_data = [
        RichPickValue(
            name=stock_name_map.get(stock_code),
            price=stock_korea_price[stock_code],
            rate=stock_daily_profit[stock_code],
        )
        for stock_code in top_10_stocks
    ]

    return RichPickResponse(response_data)
