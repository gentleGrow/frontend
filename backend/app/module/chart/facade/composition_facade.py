from collections import defaultdict

from app.module.asset.model import Asset
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.chart.constant import NONE_ACCOUNT


class CompositionFacade:
    @staticmethod
    def get_asset_stock_composition(
        assets: list[Asset], current_stock_price_map: dict[str, float], exchange_rate_map: dict[str, float]
    ) -> list[dict]:
        total_portfolio_value = 0.0
        stock_composition = defaultdict(lambda: {"name": "", "total_value": 0.0, "total_shares": 0})

        for asset in assets:
            stock_code = asset.asset_stock.stock.code
            stock_name = asset.asset_stock.stock.name
            quantity = asset.asset_stock.quantity
            current_price = current_stock_price_map.get(stock_code, 1.0)
            won_exchange_rate: float = ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
            stock_value = quantity * won_exchange_rate * current_price

            stock_composition[stock_code]["name"] = stock_name
            stock_composition[stock_code]["total_value"] += stock_value
            stock_composition[stock_code]["total_shares"] += quantity

            total_portfolio_value += stock_value

        result = []
        for stock_data in stock_composition.values():
            proportion = (stock_data["total_value"] / total_portfolio_value) * 100 if total_portfolio_value > 0 else 0

            result.append(
                {"name": stock_data["name"], "percent_rate": proportion, "current_amount": stock_data["total_value"]}
            )
        return sorted(result, key=lambda x: x["percent_rate"], reverse=True)

    @staticmethod
    def get_asset_stock_account(
        assets: list[Asset], current_stock_price_map: dict[str, float], exchange_rate_map: dict[str, float]
    ) -> list[dict]:
        total_portfolio_value = 0.0
        account_composition = defaultdict(float)

        for asset in assets:
            won_exchange_rate: float = ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
            stock_value = (
                asset.asset_stock.quantity
                * won_exchange_rate
                * current_stock_price_map.get(asset.asset_stock.stock.code, 0)
            )

            account_composition[asset.asset_stock.account_type] += stock_value
            total_portfolio_value += stock_value

        result = []
        for account, account_value in account_composition.items():
            proportion = (account_value / total_portfolio_value) * 100 if total_portfolio_value > 0 else 0
            account_name = account if account else NONE_ACCOUNT
            result.append({"name": account_name, "percent_rate": proportion, "current_amount": account_value})

        return sorted(result, key=lambda x: x["percent_rate"], reverse=True)
