from app.module.asset.enum import CurrencyType
from app.module.asset.model import Asset, Dividend
from app.module.asset.services.exchange_rate_service import ExchangeRateService


class DividendService:
    @staticmethod
    def get_total_dividend(
        assets: list[Asset],
        dividend_map: dict[str, Dividend],
        exchange_rate_map: dict[str, float],
    ) -> float:
        total_dividend_amount = 0

        for asset in assets:
            dividend_instance = dividend_map.get(asset.asset_stock.stock.code)
            dividend = dividend_instance.dividend if dividend_instance else 0

            source_country = asset.asset_stock.stock.country.upper()
            source_currency = CurrencyType[source_country]
            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )

            dividend *= won_exchange_rate
            total_dividend_amount += dividend

        return total_dividend_amount
