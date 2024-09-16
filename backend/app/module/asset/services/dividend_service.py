from app.module.asset.enum import CurrencyType
from app.module.asset.model import Asset
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from collections import defaultdict
from pandas import to_datetime
from icecream import ic
from datetime import date

class DividendService:
    @staticmethod
    async def get_total_estimate_dividend(
        assets: list[Asset],
        exchange_rate_map: dict[str, float],
        dividend_map: dict[str, float], 
    ) -> dict[str, float]:
        total_dividend_date = defaultdict(float)

        for asset in assets:
            source_country = asset.asset_stock.stock.country.upper().strip()
            source_currency = CurrencyType[source_country]
            
            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )
            
            stock_code = asset.asset_stock.stock.code
            purchase_date = asset.asset_stock.purchase_date
            quantity = asset.asset_stock.quantity

            last_dividend_date = False

            for key, dividend_amount in dividend_map.items():
                dividend_code, dividend_date_str = key.split("_")
                try:
                    dividend_date = to_datetime(dividend_date_str).date()

                    if dividend_code == stock_code and dividend_date >= purchase_date:
                        dividend_kr = dividend_amount * won_exchange_rate * quantity
                        total_dividend_date[dividend_date] += dividend_kr
                        last_dividend_date = dividend_date
                except:
                    continue
                
            if last_dividend_date:
                last_year = last_dividend_date.year - 1
                last_year_dividend_date = last_dividend_date.replace(year=last_year)
                
                for key, dividend_amount in dividend_map.items():
                    dividend_code, dividend_date_str = key.split("_")
                    try:
                        dividend_date = to_datetime(dividend_date_str).date()
                        if dividend_code == stock_code and dividend_date >= last_year_dividend_date and dividend_date <= date(last_year, 12, 31):
                            new_dividend_date = dividend_date.replace(year=last_dividend_date.year)
                            dividend_kr = dividend_amount * won_exchange_rate * quantity
                            total_dividend_date[new_dividend_date] += dividend_kr
                    except:
                        continue


        return dict(total_dividend_date)
    
    
    @staticmethod
    def get_total_dividend(
        assets: list[Asset],
        dividend_map: dict[str, float],
        exchange_rate_map: dict[str, float]
    ) -> float:
        total_dividend_amount = 0

        for asset in assets:
            dividend = dividend_map.get(asset.asset_stock.stock.code)
            if dividend is None:
                dividend = 0.0

            source_country = asset.asset_stock.stock.country.upper().strip()
            source_currency = CurrencyType[source_country]
            won_exchange_rate = ExchangeRateService.get_exchange_rate(
                source_currency, CurrencyType.KOREA, exchange_rate_map
            )

            current_dividend = dividend * won_exchange_rate * asset.asset_stock.quantity
            
            total_dividend_amount += current_dividend

        return total_dividend_amount


