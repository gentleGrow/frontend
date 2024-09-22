from datetime import date, datetime

from app.module.asset.enum import CurrencyType, PurchaseCurrencyType
from app.module.asset.model import Asset, StockDaily
from app.module.asset.schema import StockAsset
from app.module.asset.services.exchange_rate_service import ExchangeRateService

class AssetStockService:
    @staticmethod
    def get_total_asset_amount_minute(
        assets: list[Asset],
        stock_interval_date_price_map: dict[str, float],
        exchange_rate_map: dict[str, float],
        current_datetime: datetime,
    ) -> float:
        result = 0.0

        for asset in assets:
            current_price = stock_interval_date_price_map.get(f"{asset.asset_stock.stock.code}_{current_datetime}")

            if current_price is None:
                continue
            source_country = asset.asset_stock.stock.country.upper().strip()
            source_currency = CurrencyType[source_country]

            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )
            current_price *= won_exchange_rate
            result += current_price * asset.asset_stock.quantity
        return result

    @staticmethod
    def get_total_asset_amount(
        assets: list[Asset],
        current_stock_price_map: dict[str, float],
        exchange_rate_map: dict[str, float],
    ) -> float:
        result = 0.0

        for asset in assets:
            result += current_stock_price_map.get(asset.asset_stock.stock.code) * asset.asset_stock.quantity * ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
        return result

    @staticmethod
    def get_stock_assets(
        assets: list[Asset],
        stock_daily_map: dict[tuple[str, date], StockDaily],
        current_stock_price_map: dict[str, float],
        dividend_map: dict[str, float],
        exchange_rate_map: dict[str, float],
    ) -> list[StockAsset]:
        stock_assets = []

        for asset in assets:
            apply_exchange_rate:float = (
                ExchangeRateService.get_dollar_exchange_rate(asset, exchange_rate_map)
                if asset.asset_stock.purchase_currency_type == PurchaseCurrencyType.USA
                else ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
            )
            
            stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))
            purchase_price = (
                asset.asset_stock.purchase_price
                if asset.asset_stock.purchase_price 
                else stock_daily.adj_close_price
            )

            stock_asset = StockAsset(
                id=asset.id,
                account_type=asset.asset_stock.account_type,
                buy_date=asset.asset_stock.purchase_date,
                current_price=current_stock_price_map.get(asset.asset_stock.stock.code) * apply_exchange_rate,
                dividend=dividend_map.get(asset.asset_stock.stock.code, 0.0) * asset.asset_stock.quantity * apply_exchange_rate,
                highest_price=stock_daily.highest_price * apply_exchange_rate,
                investment_bank=asset.asset_stock.investment_bank,
                lowest_price=stock_daily.lowest_price * apply_exchange_rate,
                opening_price=stock_daily.opening_price * apply_exchange_rate,
                profit_rate=(((current_stock_price_map.get(asset.asset_stock.stock.code) * apply_exchange_rate) - purchase_price) / purchase_price) * 100,
                profit_amount=((current_stock_price_map.get(asset.asset_stock.stock.code) * apply_exchange_rate) - purchase_price) * asset.asset_stock.quantity,
                purchase_amount=asset.asset_stock.purchase_price * asset.asset_stock.quantity if asset.asset_stock.purchase_price else None,
                purchase_price=asset.asset_stock.purchase_price,
                purchase_currency_type=asset.asset_stock.purchase_currency_type,
                quantity=asset.asset_stock.quantity,
                stock_code=asset.asset_stock.stock.code,
                stock_name=asset.asset_stock.stock.name,
                stock_volume=stock_daily.trade_volume,
            )

            stock_assets.append(stock_asset)

        return stock_assets


    @staticmethod
    def get_total_investment_amount(
        assets: list[Asset],
        stock_daily_map: dict[tuple[str, date], StockDaily],
        exchange_rate_map: dict[str, float],
    ) -> float:
        total_invest_amount = 0.0
        

        for asset in assets:
            stock_daily = stock_daily_map.get((asset.asset_stock.stock.code, asset.asset_stock.purchase_date))
            
            invest_price = (
                asset.asset_stock.purchase_price * ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
                if asset.asset_stock.purchase_currency_type == PurchaseCurrencyType.USA and asset.asset_stock.purchase_price
                else asset.asset_stock.purchase_price
                if asset.asset_stock.purchase_price
                else stock_daily.adj_close_price * ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
            )

            total_invest_amount += invest_price * asset.asset_stock.quantity

        return total_invest_amount
