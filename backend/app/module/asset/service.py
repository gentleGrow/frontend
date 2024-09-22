from redis.asyncio import Redis

from app.module.asset.constant import CURRENCY_PAIRS
from app.module.asset.enum import CurrencyType, BaseCurrency
from app.module.asset.model import Asset, StockDaily
from app.module.asset.redis_repository import RedisExchangeRateRepository, RedisRealTimeStockRepository
from app.module.asset.schema import StockAsset


# 수정!!!! 함수가 많아져 관리가 힘들어지면서, class로 책임 범위 제한을 하려 합니다. 추후 수정 하겠습니다.
async def get_exchange_rate_map(redis_client: Redis) -> dict[str, float]:
    result = {}

    keys = [f"{source_currency}_{target_currency}" for source_currency, target_currency in CURRENCY_PAIRS]

    exchange_rates: list[float] = await RedisExchangeRateRepository.bulk_get(redis_client, keys)

    for i, key in enumerate(keys):
        rate = exchange_rates[i]

        if rate is None:
            result[key] = 0.0
        else:
            result[key] = rate

    return result


def get_exchange_rate(source: CurrencyType, target: CurrencyType, exchange_rate_map: dict[str, float]) -> float:
    if source == target:
        return 1.0

    exchange_key = source + "_" + target
    result = exchange_rate_map.get(exchange_key)

    if result is not None:
        return float(result)
    else:
        return 0.0


async def get_current_stock_price(
    redis_client: Redis, lastest_stock_daily_map: dict[tuple[str, str], StockDaily], stock_codes: list[str]
) -> dict[str, float]:
    result = {}

    current_prices = await RedisRealTimeStockRepository.bulk_get(redis_client, stock_codes)

    for i, stock_code in enumerate(stock_codes):
        current_price = current_prices[i]

        if current_price is None:
            stock_daily = lastest_stock_daily_map.get(stock_code)
            current_price = stock_daily.adj_close_price if stock_daily else 0.0

        result[stock_code] = float(current_price)
    return result


def check_not_found_stock(
    stock_daily_map: dict[tuple[str, str], StockDaily],
    current_stock_daily_map: dict[str, float],
    dummy_assets: list[Asset],
) -> list[str]:
    result = []
    for asset in dummy_assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))
        current_stock_daily = current_stock_daily_map.get(asset.asset_stock.stock.code)
        if stock_daily is None or current_stock_daily is None:
            result.append(f"{asset.asset_stock.stock.code}_{asset.asset_stock.purchase_date}")

    return result


def get_stock_assets(
    assets: list[Asset],
    stock_daily_map: dict[tuple[str, str], StockDaily],
    current_stock_price_map: dict[str, float],
    dividend_map: dict[str, float],
    base_currency: bool,
    exchange_rate_map: dict[str, float],
) -> list[StockAsset]:
    stock_assets = []
    for asset in assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))
        current_price = current_stock_price_map.get(asset.asset_stock.stock.code)

        if not stock_daily or not current_price:
            continue

        dividend = dividend_map.get(asset.asset_stock.stock.code)
        if dividend is None:
            dividend = 0.0

        purchase_price = (
            asset.asset_stock.purchase_price
            if asset.asset_stock.purchase_price is not None
            else stock_daily.adj_close_price
        )

        profit_rate = ((current_price - purchase_price) / purchase_price) * 100
        source_country = asset.asset_stock.stock.country.upper().strip()
        source_currency = CurrencyType[source_country]
        won_exchange_rate = get_exchange_rate(source_currency, CurrencyType.KOREA, exchange_rate_map)

        if base_currency == BaseCurrency.WON:
            current_price = current_price * won_exchange_rate
            opening_price = stock_daily.opening_price * won_exchange_rate
            highest_price = stock_daily.highest_price * won_exchange_rate
            lowest_price = stock_daily.lowest_price * won_exchange_rate
            purchase_price *= won_exchange_rate
            dividend *= won_exchange_rate
        else:
            current_price = current_price
            opening_price = stock_daily.opening_price
            highest_price = stock_daily.highest_price
            lowest_price = stock_daily.lowest_price
            purchase_price = purchase_price

        purchase_amount = purchase_price * asset.asset_stock.quantity

        stock_asset = StockAsset(
            id=asset.id,
            account_type=asset.asset_stock.account_type,
            buy_date=asset.asset_stock.purchase_date,
            current_price=current_price,
            dividend=dividend * asset.asset_stock.quantity,
            highest_price=highest_price,
            investment_bank=asset.asset_stock.investment_bank,
            lowest_price=lowest_price,
            opening_price=opening_price,
            profit_rate=profit_rate,
            profit_amount=current_price - purchase_price,
            purchase_amount=purchase_amount,
            purchase_price=purchase_price,
            purchase_currency_type=asset.asset_stock.purchase_currency_type,
            quantity=asset.asset_stock.quantity,
            stock_code=asset.asset_stock.stock.code,
            stock_name=asset.asset_stock.stock.name,
            stock_volume=stock_daily.trade_volume,
        )

        stock_assets.append(stock_asset)

    return stock_assets


def get_total_dividend(
    assets: list[Asset],
    dividend_map: dict[str, float],
    exchange_rate_map: dict[str, float],
) -> float:
    total_dividend_amount = 0.0

    for asset in assets:
        dividend = dividend_map.get(asset.asset_stock.stock.code)
        if dividend is None:
            dividend = 1.0

        source_country = asset.asset_stock.stock.country.upper().strip()
        source_currency = CurrencyType[source_country]
        won_exchange_rate = get_exchange_rate(source_currency, CurrencyType.KOREA, exchange_rate_map)

        dividend *= won_exchange_rate
        total_dividend_amount += dividend

    return total_dividend_amount


def get_total_asset_amount(
    assets: list[Asset],
    current_stock_price_map: dict[str, float],
    exchange_rate_map: dict[str, float],
) -> float:
    total_asset_amount = 0

    for asset in assets:
        current_price = current_stock_price_map.get(asset.asset_stock.stock.code)
        if current_price is None:
            continue

        source_country = asset.asset_stock.stock.country.upper().strip()
        source_currency = CurrencyType[source_country]

        won_exchange_rate = get_exchange_rate(source_currency, CurrencyType.KOREA, exchange_rate_map)

        current_price *= won_exchange_rate
        total_asset_amount += current_price * asset.asset_stock.quantity

    return total_asset_amount


def get_total_investment_amount(
    assets: list[Asset],
    stock_daily_map: dict[tuple[str, str], StockDaily],
    exchange_rate_map: dict[str, float],
) -> float:
    total_invest_amount = 0

    for asset in assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))

        if stock_daily is None:
            continue

        invest_price = (
            asset.asset_stock.purchase_price
            if asset.asset_stock.purchase_price is not None
            else stock_daily.adj_close_price
        )

        source_country = asset.asset_stock.stock.country.upper().strip()
        source_currency = CurrencyType[source_country]
        won_exchange_rate = get_exchange_rate(source_currency, CurrencyType.KOREA, exchange_rate_map)

        invest_price *= won_exchange_rate

        total_invest_amount += invest_price * asset.asset_stock.quantity

    return total_invest_amount


# 수정!!!! 함수가 많아져 관리가 힘들어지면서, class로 책임 범위 제한을 하려 합니다. 추후 수정 하겠습니다.
