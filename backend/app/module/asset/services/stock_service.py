from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import Asset, StockDaily
from app.module.asset.redis_repository import RedisRealTimeStockRepository
from app.module.chart.enum import IntervalType


class StockService:
    @staticmethod
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

    @staticmethod
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
                result.append(asset.asset_stock.stock.code)
                continue
        return result
