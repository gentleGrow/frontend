from collections import defaultdict
from datetime import date

from app.module.asset.model import Asset
from app.module.asset.services.dividend_service import DividendService
from app.module.asset.services.exchange_rate_service import ExchangeRateService


class DividendFacade:
    @staticmethod
    async def get_composition(
        assets: list[Asset],
        exchange_rate_map: dict[str, float],
        dividend_map: dict[str, float],
    ) -> list[tuple[str, float, float]]:
        if len(assets) == 0:
            return []

        total_dividend: defaultdict[str, float] = defaultdict(float)
        total_dividend_sum = 0.0

        for asset in assets:
            won_exchange_rate: float = ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)

            dividend = dividend_map.get(asset.asset_stock.stock.code)

            if dividend is None:
                continue

            total_dividend[asset.asset_stock.stock.code] += dividend * won_exchange_rate * asset.asset_stock.quantity
            total_dividend_sum += dividend * won_exchange_rate * asset.asset_stock.quantity

        return [
            (stock_code, dividend, (dividend / total_dividend_sum) * 100 if total_dividend_sum > 0 else 0.0)
            for stock_code, dividend in total_dividend.items()
            if dividend > 0
        ]

    @staticmethod
    def get_full_month_estimate_dividend(
        assets: list[Asset], exchange_rate_map: dict[str, float], dividend_map: dict[tuple[str, date], float]
    ) -> dict[date, float]:
        total_dividend_date: defaultdict[date, float] = defaultdict(float)

        for asset in assets:
            won_exchange_rate: float = ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)

            asset_dividend, last_dividend_date = DividendService.get_asset_total_dividend(
                won_exchange_rate=won_exchange_rate, dividend_map=dividend_map, asset=asset
            )

            for dividend_date, amount in asset_dividend.items():
                total_dividend_date[dividend_date] += amount

            if last_dividend_date is None:
                continue

            last_year_dividends = DividendService.get_last_year_dividends(
                asset=asset,
                dividend_map=dividend_map,
                won_exchange_rate=won_exchange_rate,
                last_dividend_date=last_dividend_date,
            )

            for dividend_date, amount in last_year_dividends.items():
                total_dividend_date[dividend_date] += amount

        return {dividend_date: amount for dividend_date, amount in total_dividend_date.items()}
