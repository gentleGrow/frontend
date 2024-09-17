import json
from collections import defaultdict
from datetime import date, datetime, time, timedelta
from icecream import ic
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AssetType, MarketIndex
from app.module.asset.model import MarketIndexDaily, StockDaily, StockMinutely
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.market_index_daily_repository import MarketIndexDailyRepository
from app.module.asset.repository.market_index_minutely_repository import MarketIndexMinutelyRepository
from app.module.asset.repository.stock_daily_repository import StockDailyRepository
from app.module.asset.repository.stock_minutely_repository import StockMinutelyRepository
from app.module.asset.services.asset_stock_service import AssetStockService
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.asset.services.stock_service import StockService
from app.module.chart.enum import IntervalType
from app.module.chart.redis_repository import RedisMarketIndiceRepository


class PerformanceAnalysis:
    @staticmethod
    async def get_user_analysis_short(
        session: AsyncSession,
        redis_client: Redis,
        interval_start: datetime,
        interval_end: datetime,
        user_id: int,
        interval: IntervalType,
    ) -> list:
        assets = await AssetRepository.get_eager_by_range(
            session, user_id, AssetType.STOCK, (interval_start, interval_end)
        )

        stock_code_date_pairs = [(asset.asset_stock.stock.code, asset.asset_stock.purchase_date) for asset in assets]
        stock_dailies: list[StockDaily] = await StockDailyRepository.get_stock_dailies_by_code_and_date(
            session, stock_code_date_pairs
        )
        stock_daily_map = {(daily.code, daily.date): daily for daily in stock_dailies}

        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)

        stock_codes = [asset.asset_stock.stock.code for asset in assets]
        interval_data: list[StockMinutely] = await StockMinutelyRepository.get_by_range_interval_minute(
            session, (interval_start, interval_end), stock_codes, interval.get_interval()
        )

        stock_interval_date_price_map = {
            f"{stock_minutely.code}_{stock_minutely.datetime}": stock_minutely.current_price
            for stock_minutely in interval_data
        }

        assets_by_date = defaultdict(list)
        for asset in assets:
            assets_by_date[asset.asset_stock.purchase_date].append(asset)

        result_date: list = []
        result_profit:list = []
        cumulative_assets = []

        min_purchase_date = min(assets_by_date.keys())
        min_purchase_datetime = datetime.combine(min_purchase_date, time.min)
        current_datetime = min(
            stock_minutely.datetime
            for stock_minutely in interval_data
            if stock_minutely.datetime > min_purchase_datetime
        )

        for purchase_date, assets in sorted(assets_by_date.items()):
            cumulative_assets.extend(assets)

            purchase_datetime_max = min_purchase_datetime = datetime.combine(purchase_date, time.max)

            while current_datetime < purchase_datetime_max:
                total_asset_amount = AssetStockService.get_total_asset_amount_minute(
                    assets, stock_interval_date_price_map, exchange_rate_map, current_datetime
                )

                total_invest_amount = AssetStockService.get_total_investment_amount(
                    cumulative_assets, stock_daily_map, exchange_rate_map
                )

                total_profit_rate = 0.0
                if total_invest_amount > 0:
                    total_profit_rate = ((total_asset_amount - total_invest_amount) / total_invest_amount) * 100

                result_date.append(current_datetime)
                result_profit.append(total_profit_rate)

                current_datetime += timedelta(minutes=interval.get_interval())

        return result_date, result_profit

    @staticmethod
    async def get_user_analysis(
        session: AsyncSession, redis_client: Redis, interval_start: date, interval_end: date, user_id: int
    ) -> list:
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
        result_date = []
        result_profit = []

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

            result_date.append(purchase_date)
            result_profit.append(total_profit_rate)

        return result_date, result_profit

    @staticmethod
    async def get_market_analysis_short(
        session: AsyncSession,
        redis_client: Redis,
        interval_start: datetime,
        interval_end: datetime,
        interval: IntervalType,
    ) -> list:
        market_data: list[MarketIndexDaily] = await MarketIndexMinutelyRepository.get_by_range_interval_minute(
            session, (interval_start, interval_end), MarketIndex.KOSPI, interval.get_interval()
        )

        current_kospi_price_raw = await RedisMarketIndiceRepository.get(redis_client, MarketIndex.KOSPI)
        current_kospi_price_json = json.loads(current_kospi_price_raw)
        current_kospi_price = float(current_kospi_price_json["current_value"])

        result_date = []
        result_profit = []
        for market_index in market_data:
            profit = ((current_kospi_price - market_index.current_price) / market_index.current_price) * 100

            result_date.append(market_index.datetime)
            result_profit.append(profit)

        return result_date, result_profit

    @staticmethod
    async def get_market_analysis(
        session: AsyncSession, redis_client: Redis, interval_start: date, interval_end: date
    ) -> list:
        market_data: list[MarketIndexDaily] = await MarketIndexDailyRepository.get_by_range(
            session, (interval_start, interval_end), MarketIndex.KOSPI
        )

        current_kospi_price_raw = await RedisMarketIndiceRepository.get(redis_client, MarketIndex.KOSPI)
        current_kospi_price_json = json.loads(current_kospi_price_raw)
        current_kospi_price = float(current_kospi_price_json["current_value"])

        result_date = []
        result_profit = []
        for market_index in market_data:
            profit = ((current_kospi_price - market_index.close_price) / market_index.close_price) * 100
            result_date.append(market_index.date)
            result_profit.append(profit)

        return result_date, result_profit
