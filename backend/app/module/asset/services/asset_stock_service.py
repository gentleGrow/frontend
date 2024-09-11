from app.module.asset.enum import CurrencyType
from app.module.asset.model import Asset, Dividend, StockDaily
from app.module.asset.schema import StockAsset
from app.module.asset.services.exchange_rate_service import ExchangeRateService


class AssetStockService:
    @staticmethod
    def get_stock_assets(
        assets: list[Asset],
        stock_daily_map: dict[tuple[str, str], StockDaily],
        current_stock_price_map: dict[str, float],
        dividend_map: dict[str, Dividend],
        base_currency: bool,
        exchange_rate_map: dict[str, float],
    ) -> list[StockAsset]:
        stock_assets = []

        for asset in assets:
            stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))
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

            profit_rate = ((current_price - purchase_price) / purchase_price) * 100
            source_country = asset.asset_stock.stock.country.upper()
            source_currency = CurrencyType[source_country]
            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )

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

    @staticmethod
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

            source_country = asset.asset_stock.stock.country.upper()
            source_currency = CurrencyType[source_country]

            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )

            current_price *= won_exchange_rate

            total_asset_amount += current_price * asset.asset_stock.quantity
        return total_asset_amount

    @staticmethod
    def get_total_investment_amount(
        assets: list[Asset],
        stock_daily_map: dict[tuple[str, str], StockDaily],
        exchange_rate_map: dict[str, float],
    ) -> float:
        total_invest_amount = 0.0

        for asset in assets:
            stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))

            if stock_daily is None:
                continue

            invest_price = (
                asset.asset_stock.purchase_price
                if asset.asset_stock.purchase_price is not None
                else stock_daily.adj_close_price
            )

            source_country = asset.asset_stock.stock.country.upper()
            source_currency = CurrencyType[source_country]
            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )

            invest_price *= won_exchange_rate

            total_invest_amount += invest_price * asset.asset_stock.quantity

        return total_invest_amount
