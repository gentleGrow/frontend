from app.module.asset.enum import CurrencyType
from app.module.asset.model import Asset, Dividend, ExchangeRate, StockDaily
from app.module.asset.schema.stock_schema import StockAsset


def get_exchange_rate(exchange_rates: list[ExchangeRate], source: CurrencyType, target: CurrencyType) -> float:
    if source == target:
        return 1.0

    for exchange_rate in exchange_rates:
        if exchange_rate.source_currency == source and exchange_rate.target_currency == target:
            return exchange_rate.rate

    return 1.0


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


def get_asset_response_data(
    dummy_assets: list[Asset],
    stock_daily_map: dict[tuple[str, str], StockDaily],
    current_stock_daily_map: dict[str, StockDaily],
    dividend_map: dict[str, Dividend],
    exchange_rates: list[ExchangeRate],
    base_currency: bool,
) -> tuple[list[StockAsset], float, float, float, float]:
    stock_assets = []
    total_asset_amount = 0
    total_invest_amount = 0
    total_dividend_amount = 0

    for asset in dummy_assets:
        stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.purchase_date))
        current_stock_daily = current_stock_daily_map.get(asset.asset_stock.stock.code)

        if not stock_daily or not current_stock_daily:
            continue

        dividend_instance = dividend_map.get(asset.asset_stock.stock.code)
        dividend = dividend_instance.dividend if dividend_instance else 0

        purchase_price = (
            asset.asset_stock.purchase_price
            if asset.asset_stock.purchase_price is not None
            else stock_daily.adj_close_price
        )

        profit = (
            (current_stock_daily.adj_close_price - stock_daily.adj_close_price) / stock_daily.adj_close_price
        ) * 100

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

    total_invest_growth_rate = ((total_asset_amount - total_invest_amount) / total_invest_amount) * 100

    return stock_assets, total_asset_amount, total_invest_amount, total_invest_growth_rate, total_dividend_amount
