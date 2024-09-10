import json
from collections import defaultdict
from datetime import date, datetime

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AssetType, MarketIndex
from app.module.asset.model import MarketIndexDaily, StockDaily
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.market_index_daily_repository import MarketIndexDailyRepository
from app.module.asset.repository.market_index_minutely_repository import MarketIndexMinutelyRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.services.asset_stock_service import AssetStockService
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.asset.services.stock_service import StockService
from app.module.auth.constant import DUMMY_NAME
from app.module.chart.redis_repository import RedisMarketIndiceRepository


class PerformanceAnalysis:
    @staticmethod
    async def get_user_analysis_hourly(
        session: AsyncSession, redis_client: Redis, interval_start: date, interval_end: date, user_id: int
    ) -> list[dict]:
        return []

    @staticmethod
    async def get_user_analysis(
        session: AsyncSession, redis_client: Redis, interval_start: date, interval_end: date, user_id: int
    ) -> list[dict]:
        assets = await AssetRepository.get_eager_by_range(
            session, user_id, AssetType.STOCK, (interval_start, interval_end)
        )

        stock_codes = [asset.asset_stock.stock.code for asset in assets]
        stock_code_date_pairs = [(asset.asset_stock.stock.code, asset.asset_stock.purchase_date) for asset in assets]

        stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies_by_code_and_date(
            session, stock_code_date_pairs
        )
        stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}

        latest_stock_dailies: list[StockDaily] = await StockDailyRepository.get_latest(session, stock_codes)
        latest_stock_daily_map = {daily.code: daily for daily in latest_stock_dailies}

        current_stock_price_map = await StockService.get_current_stock_price(
            redis_client, latest_stock_daily_map, stock_codes
        )
        exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

        assets_by_date = defaultdict(list)
        for asset in assets:
            assets_by_date[asset.asset_stock.purchase_date].append(asset)

        cumulative_assets = []
        result = []

        for purchase_date, assets_for_date in sorted(assets_by_date.items()):
            cumulative_assets.extend(assets_for_date)

            total_asset_amount = AssetStockService.get_total_asset_amount(
                cumulative_assets, current_stock_price_map, exchange_rate_map
            )
            total_invest_amount = AssetStockService.get_total_investment_amount(
                cumulative_assets, stock_daily_map, exchange_rate_map
            )

            total_profit_rate = 0.0
            if total_invest_amount > 0:
                total_profit_rate = ((total_asset_amount - total_invest_amount) / total_invest_amount) * 100

            result.append(
                {
                    "date": purchase_date,
                    "name": DUMMY_NAME,
                    "profit": total_profit_rate,
                }
            )

        return result

    @staticmethod
    async def get_market_analysis_hourly(
        session: AsyncSession, redis_client: Redis, interval_start: datetime, interval_end: datetime
    ) -> list[dict]:
        market_data: list[MarketIndexDaily] = await MarketIndexMinutelyRepository.get_by_range_market(
            session, (interval_start, interval_end), MarketIndex.KOSPI
        )

        current_kospi_price_raw = await RedisMarketIndiceRepository.get(redis_client, MarketIndex.KOSPI)
        current_kospi_price_json = json.loads(current_kospi_price_raw)
        current_kospi_price = float(current_kospi_price_json["current_value"])

        result = []
        for market_index in market_data:
            profit = ((current_kospi_price - market_index.current_price) / market_index.current_price) * 100

            result.append({"date": market_index.datetime, "name": MarketIndex.KOSPI.value, "profit": profit})

        return result

    @staticmethod
    async def get_market_analysis(
        session: AsyncSession, redis_client: Redis, interval_start: date, interval_end: date
    ) -> list[dict]:
        market_data: list[MarketIndexDaily] = await MarketIndexDailyRepository.get_by_range_market(
            session, (interval_start, interval_end), MarketIndex.KOSPI
        )

        current_kospi_price_raw = await RedisMarketIndiceRepository.get(redis_client, MarketIndex.KOSPI)
        current_kospi_price_json = json.loads(current_kospi_price_raw)
        current_kospi_price = float(current_kospi_price_json["current_value"])

        result = []
        for market_index in market_data:
            profit = ((current_kospi_price - market_index.close_price) / market_index.close_price) * 100
            result.append({"date": market_index.date, "name": MarketIndex.KOSPI.value, "profit": profit})

        return result
