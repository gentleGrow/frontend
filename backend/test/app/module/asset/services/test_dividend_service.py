from pytest import approx
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import date
from app.module.asset.enum import AssetType
from app.module.asset.model import Asset
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.services.dividend_service import DividendService
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.auth.constant import DUMMY_USER_ID
from collections import defaultdict
from app.module.asset.model import Stock, AssetStock
from app.module.chart.schema import EstimateDividendEveryValue
from icecream import ic


class TestDividendService:
    def test_process_dividends_by_year_month(
        self,
        setup_all
    ):
        # Given
        total_dividends = {
            date(2024, 1, 15): 100.0,
            date(2024, 3, 20): 200.0,
            date(2024, 7, 5): 300.0,
            date(2023, 12, 25): 150.0,
            date(2023, 2, 10): 50.0,
        }

        expected_result = {
            "2023": EstimateDividendEveryValue(
                xAxises=["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
                data=[0.0, 50.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 150.0],
                unit="만원",
                total=200.0,
            ),
            "2024": EstimateDividendEveryValue(
                xAxises=["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
                data=[100.0, 0.0, 200.0, 0.0, 0.0, 0.0, 300.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                unit="만원",
                total=600.0,
            ),
        }

        # When
        result = DividendService.process_dividends_by_year_month(total_dividends)

        # Then
        for year in expected_result:
            assert year in result
            assert result[year].xAxises == expected_result[year].xAxises
            assert result[year].data == approx(expected_result[year].data)
            assert result[year].unit == expected_result[year].unit
            assert result[year].total == approx(expected_result[year].total)
    
    
    async def test_get_last_year_dividends(
        self, 
        setup_all,           
        session: AsyncSession 
    ):
        # Given
        assets = await AssetRepository.get_assets(session, DUMMY_USER_ID)
        asset = assets[0]

        dividend_map = {
            ("AAPL", date(2024, 8, 13)): 1.5,
            ("AAPL", date(2024, 8, 14)): 1.6,
            ("AAPL", date(2023, 8, 13)): 1.4, 
            ("AAPL", date(2023, 11, 14)): 1.5,
        }
        won_exchange_rate = 1300.0
        last_dividend_date = date(2024, 8, 14)

        # When
        result = DividendService.get_last_year_dividends(
            asset=asset,
            dividend_map=dividend_map,
            won_exchange_rate=won_exchange_rate,
            last_dividend_date=last_dividend_date
        )

        # Then
        expected_result = defaultdict(float, {
            date(2024, 11, 14): 1.5 * 1300 * asset.asset_stock.quantity,
        })

        for key in expected_result:
            assert result[key] == approx(expected_result[key])
    
    def test_get_asset_total_dividend(
        self,
        setup_all, 
    ):
        # Given
        asset = Asset(
            asset_stock=AssetStock(
                purchase_date=date(2024, 8, 13),
                stock=Stock(code="AAPL"),
                quantity=10
            )
        )
        
        won_exchange_rate = 1300.0  

        dividend_map = {
            ("AAPL", date(2024, 8, 13)): 1.5,
            ("AAPL", date(2024, 8, 14)): 1.6,
            ("TSLA", date(2024, 8, 14)): 0.9,  
        }

        # When
        result, last_dividend_date = DividendService.get_asset_total_dividend(
            won_exchange_rate=won_exchange_rate,
            dividend_map=dividend_map,
            asset=asset,
        )

        # Then
        expected_result = defaultdict(float)
        expected_result[date(2024, 8, 13)] = 1.5 * won_exchange_rate * asset.asset_stock.quantity
        expected_result[date(2024, 8, 14)] = 1.6 * won_exchange_rate * asset.asset_stock.quantity
        expected_last_dividend_date = date(2024, 8, 14)

        assert result == expected_result
        assert last_dividend_date == expected_last_dividend_date
    
    async def test_get_dividend_map(
        self,
        session: AsyncSession,
        setup_all
    ):
        # Given
        assets = await session.execute(select(Asset).filter(Asset.user_id == DUMMY_USER_ID))
        assets = assets.scalars().all()

        # When
        dividend_map = await DividendService.get_dividend_map(session, assets)

        # Then
        expected_dividend_map = {
            ("AAPL", date(2024, 8, 13)): 1.5,
            ("AAPL", date(2024, 8, 14)): 1.6,
            ("TSLA", date(2024, 8, 13)): 0.8,
            ("TSLA", date(2024, 8, 14)): 0.9,
            ("005930", date(2024, 8, 13)): 100.0,
            ("005930", date(2024, 8, 14)): 105.0,
        }
        
        assert dividend_map == expected_dividend_map
    
    async def test_get_recent_map(self, session: AsyncSession, setup_dividend, setup_asset):
        # Given
        assets = await session.execute(select(Asset).filter(Asset.user_id == DUMMY_USER_ID))
        assets = assets.scalars().all()

        # When
        result = await DividendService.get_recent_map(session, assets)

        # Then
        assert result["AAPL"] == 1.60
        assert result["TSLA"] == 0.90

    async def test_get_total_dividend(
        self, session: AsyncSession, redis_client: Redis, setup_exchange_rate, setup_asset, setup_dividend
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
        dividend_map = await DividendService.get_recent_map(session, assets)
        exchange_rate_map = await ExchangeRateService.get_exchange_rate_map(redis_client)

        # When
        total_dividend = DividendService.get_total_dividend(
            assets=assets,
            dividend_map=dividend_map,
            exchange_rate_map=exchange_rate_map,
        )

        # Then
        expected_total_dividend = 0.0
        for asset in assets:
            dividend_per_stock = dividend_map.get(asset.asset_stock.stock.code, 0.0)
            exchange_rate = ExchangeRateService.get_won_exchange_rate(asset, exchange_rate_map)
            expected_total_dividend += dividend_per_stock * asset.asset_stock.quantity * exchange_rate

        assert total_dividend == approx(expected_total_dividend)
