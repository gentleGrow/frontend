from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AssetType, CurrencyType
from app.module.asset.exception import NotFoundStockCodesException
from app.module.asset.model import Asset, Dividend, ExchangeRate, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.dividend_repository import DividendRepository
from app.module.asset.repository.exchange_rate_repository import ExchangeRateRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.schema.stock_schema import StockAsset, StockAssetResponse
from app.module.auth.constant import DUMMY_USER_ID
from database.singleton import redis_stock_repository


def get_exchange_rate(exchange_rates: list[ExchangeRate], source: CurrencyType, target: CurrencyType) -> float:
    if source == target:
        return 1.0

    for exchange_rate in exchange_rates:
        if exchange_rate.source_currency == source and exchange_rate.target_currency == target:
            return exchange_rate.rate

    return 1.0


async def get_eager_asset_with_stock_by_user_id(
    session: AsyncSession, user_id: int, asset_type: AssetType
) -> tuple[list[Asset], list[StockDaily], list[Dividend], list[ExchangeRate]]:
    dummy_assets: list[Asset] = await AssetRepository.get_by_asset_type_eager(session, user_id, asset_type)
    stock_codes = [asset.asset_stock.stock.code for asset in dummy_assets]
    stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies(session, stock_codes)
    dividends: list[Dividend] = await DividendRepository.get_dividends(session, stock_codes)
    exchange_rates: list[ExchangeRate] = await ExchangeRateRepository.get_exchange_rates(session)
    return dummy_assets, stock_dailies, dividends, exchange_rates


def get_stock_mapping_info(
    stock_dailies: list[StockDaily], dividends: list[Dividend]
) -> tuple[dict[tuple[str, str], StockDaily], dict[str, Dividend], dict[str, StockDaily]]:
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    dividend_map = {dividend.stock_code: dividend for dividend in dividends}

    current_stock_daily_map: dict[str, StockDaily] = {}
    for daily in stock_dailies:
        if daily.code not in current_stock_daily_map or daily.date > current_stock_daily_map[daily.code].date:
            current_stock_daily_map[daily.code] = daily

    return stock_daily_map, dividend_map, current_stock_daily_map


async def get_dummy_assets_and_stock(session: AsyncSession, base_currency: bool) -> StockAssetResponse:
    # dummy_asset_cache = await redis_stock_repository.get_dummy_asset()
    # if dummy_asset_cache:
    #     return dummy_asset_cache

    dummy_assets, stock_dailies, dividends, exchange_rates = await get_eager_asset_with_stock_by_user_id(
        session, DUMMY_USER_ID, AssetType.STOCK
    )
    stock_daily_map, dividend_map, current_stock_daily_map = get_stock_mapping_info(stock_dailies, dividends)

    stock_assets = []
    total_asset_amount = 0
    total_invest_amount = 0
    total_dividend_amount = 0

    not_found_stock_codes = []

    for asset in dummy_assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.purchase_date))
        current_stock_daily = current_stock_daily_map.get(asset.asset_stock.stock.code)

        dividend_instance = dividend_map.get(asset.asset_stock.stock.code)
        dividend = dividend_instance.dividend if dividend_instance else 0

        if stock_daily is None or current_stock_daily is None:
            not_found_stock_codes.append(asset.asset_stock.stock.code)
            continue

        purchase_price = (
            asset.asset_stock.purchase_price
            if asset.asset_stock.purchase_price is not None
            else stock_daily.adj_close_price
        )
        profit = (current_stock_daily.adj_close_price / stock_daily.adj_close_price - 1) * 100

        source_country = asset.asset_stock.stock.country.upper()

        source_currency = CurrencyType[source_country]

        won_exchange_rate = get_exchange_rate(exchange_rates, source_currency, CurrencyType.KOREA)

        if base_currency:
            current_price = current_stock_daily.adj_close_price * won_exchange_rate
            opening_price = stock_daily.opening_price * won_exchange_rate
            highest_price = stock_daily.highest_price * won_exchange_rate
            lowest_price = stock_daily.lowest_price * won_exchange_rate
            purchase_price *= won_exchange_rate
            dividend *= won_exchange_rate  # type: ignore
        else:
            current_price = current_stock_daily.adj_close_price
            opening_price = stock_daily.opening_price
            highest_price = stock_daily.highest_price
            lowest_price = stock_daily.lowest_price
            purchase_price = purchase_price

        purchase_amount = purchase_price * asset.quantity

        stock_asset = StockAsset(
            stock_code=asset.asset_stock.stock.code,
            stock_name=asset.asset_stock.stock.name,
            quantity=asset.quantity,
            buy_date=asset.purchase_date,
            profit=profit,
            current_price=current_price,
            opening_price=opening_price,
            highest_price=highest_price,
            lowest_price=lowest_price,
            stock_volume=stock_daily.trade_volume,
            investment_bank=asset.investment_bank,
            dividend=dividend * asset.quantity,
            purchase_price=purchase_price,
            purchase_amount=purchase_amount,
        )

        total_dividend_amount += dividend
        total_asset_amount += current_stock_daily.adj_close_price * won_exchange_rate * asset.quantity
        total_invest_amount += stock_daily.adj_close_price * won_exchange_rate * asset.quantity

        stock_assets.append(stock_asset)

    if not_found_stock_codes:
        raise NotFoundStockCodesException(not_found_stock_codes)

    total_invest_growth_rate = ((total_asset_amount - total_invest_amount) / total_invest_amount) * 100

    result = StockAssetResponse(
        stock_assets=stock_assets,
        total_asset_amount=total_asset_amount,
        total_asset_growth_rate=0,  # %는 데이터 수집이 안정화 된 후 진행 하겠습니다.
        total_invest_amount=total_invest_amount,
        total_invest_growth_rate=total_invest_growth_rate,
        total_profit_amount=total_asset_amount - total_invest_amount,
        total_profit_rate=0,  # %는 데이터 수집이 안정화 된 후 진행 하겠습니다.
        total_dividend_amount=total_dividend_amount,
    )

    await redis_stock_repository.save_dummy_asset(result)
    return result
