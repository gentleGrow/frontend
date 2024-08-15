from redis.asyncio import Redis

from app.module.asset.constant import currency_pairs
from app.module.asset.enum import CurrencyType
from app.module.asset.model import Asset, Dividend, StockDaily
from app.module.asset.schema.stock_schema import StockAsset
from database.redis import RedisExchangeRateRepository, RedisRealTimeStockRepository


async def get_exchange_rate_map(redis_client: Redis) -> dict[str, float]:
    exchange_rate_map = {}

    keys = [f"{source_currency}_{target_currency}" for source_currency, target_currency in currency_pairs]

    exchange_rates = await RedisExchangeRateRepository.bulk_get(redis_client, keys)

    for i, key in enumerate(keys):
        rate = exchange_rates[i]

        if rate is not None and isinstance(rate, (int, float, str)):
            exchange_rate_map[key] = float(rate)
        else:
            exchange_rate_map[key] = 0.0

    return exchange_rate_map


def get_exchange_rate(source: CurrencyType, target: CurrencyType, exchange_rate_map: dict[str, float]) -> float:
    if source == target:
        return 1.0

    exchange_key = source + "_" + target
    result = exchange_rate_map.get(exchange_key)

    if result is not None:
        return result
    else:
        return 0.0


def get_stock_mapping_info(
    stock_dailies: list[StockDaily], dividends: list[Dividend]
) -> tuple[dict[tuple[str, str], StockDaily], dict[str, Dividend]]:
    stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}
    dividend_map = {dividend.stock_code: dividend for dividend in dividends}

    return stock_daily_map, dividend_map


async def get_current_stock_price(
    redis_client: Redis, stock_daily_map: dict[tuple[str, str], StockDaily], stock_codes: list[str]
) -> dict[str, float]:
    result = {}

    current_prices = await RedisRealTimeStockRepository.bulk_get(redis_client, stock_codes)

    for i, stock_code in enumerate(stock_codes):
        current_price = current_prices[i]

        # [수정] redis에서 반환된 경우, 타입 체킹을 어떤 식으로 적용할지 확인 후, type ignore를 지우겠습니다.
        if current_price is None:
            latest_date = max([date for (code, date) in stock_daily_map.keys() if code == stock_code], default=None)  # type: ignore
            print(f"{latest_date=}")
            stock_daily = stock_daily_map.get((stock_code, latest_date))  # type: ignore
            current_price = stock_daily.adj_close_price if stock_daily else 0.0  # type: ignore

        result[stock_code] = float(current_price)  # type: ignore
    return result


def check_not_found_stock(
    stock_daily_map: dict[tuple[str, str], StockDaily],
    current_stock_daily_map: dict[str, StockDaily],
    dummy_assets: list[Asset],
) -> list[str]:
    result = []
    for asset in dummy_assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.purchase_date))
        current_stock_daily = current_stock_daily_map.get(asset.asset_stock.stock.code)
        if stock_daily is None or current_stock_daily is None:
            result.append(asset.asset_stock.stock.code)
            continue
    return result


def get_total_asset_data(
    dummy_assets: list[Asset],
    stock_daily_map: dict[tuple[str, str], StockDaily],
    current_stock_price_map: dict[str, float],
    dividend_map: dict[str, Dividend],
    base_currency: bool,
    exchange_rate_map: dict[str, float],
) -> tuple[list[StockAsset], float, float, float, float]:
    stock_assets = []
    total_asset_amount = 0
    total_invest_amount = 0
    total_dividend_amount = 0

    for asset in dummy_assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.purchase_date))
        current_price = current_stock_price_map.get(asset.asset_stock.stock.code)

        if not stock_daily or not current_price:
            continue

        dividend_instance = dividend_map.get(asset.asset_stock.stock.code)
        dividend = dividend_instance.dividend if dividend_instance else 0

        purchase_price = (
            asset.asset_stock.purchase_price
            if asset.asset_stock.purchase_price is not None
            else stock_daily.adj_close_price
        )

        profit = ((current_price - purchase_price) / purchase_price) * 100

        source_country = asset.asset_stock.stock.country.upper()

        source_currency = CurrencyType[source_country]

        won_exchange_rate = get_exchange_rate(source_currency, CurrencyType.KOREA, exchange_rate_map)

        # [수정] redis에서 반환된 경우, 타입 체킹을 어떤 식으로 적용할지 확인 후, type ignore를 지우겠습니다.
        if base_currency:
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
        total_asset_amount += current_price * won_exchange_rate * asset.quantity
        total_invest_amount += stock_daily.adj_close_price * won_exchange_rate * asset.quantity

        stock_assets.append(stock_asset)

    total_invest_growth_rate = ((total_asset_amount - total_invest_amount) / total_invest_amount) * 100

    return stock_assets, total_asset_amount, total_invest_amount, total_invest_growth_rate, total_dividend_amount
