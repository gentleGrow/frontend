from datetime import date
from pytest import approx
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.model import Asset
from app.module.asset.services.exchange_rate_service import ExchangeRateService
from app.module.chart.facade.dividend_facade import DividendFacade
from app.module.auth.constant import DUMMY_USER_ID
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.enum import AssetType
from icecream import ic


class TestDividendFacade:
    async def test_get_composition(
        self,
        setup_all,
        session: AsyncSession,
        redis_client: Redis
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)

        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)
        
        dividend_map = {
            "AAPL": 1.5,
            "TSLA": 0.8,
            "005930": 100.0, 
        }

        # When
        result = await DividendFacade.get_composition(
            assets=assets,
            exchange_rate_map=exchange_rate_map,
            dividend_map=dividend_map,
        )

        result = sorted(result, key=lambda x: x[0])


        # Then
        expected_result = [
            ("AAPL", approx(1.5 * 1300), approx((1.5 * 1300) / (1.5 * 1300 + (0.8 * 1300 * 2) + 100.0 * 1.0) * 100)),
            ("TSLA", approx(0.8 * 1300 * 2), approx((0.8 * 1300 * 2) / (1.5 * 1300 + (0.8 * 1300 * 2) + 100.0 * 1.0) * 100)),
            ("005930", approx(100.0 * 1.0), approx((100.0 * 1.0) / (1.5 * 1300 + (0.8 * 1300 * 2) + 100.0 * 1.0) * 100)),
        ]

        expected_result = sorted(expected_result, key=lambda x: x[0])  

    
        for (stock_code, dividend, percentage), (expected_stock_code, expected_dividend, expected_percentage) in zip(result, expected_result):
            assert stock_code == expected_stock_code
            assert dividend == expected_dividend
            assert percentage == approx(expected_percentage)

    
    
    async def test_get_full_month_estimate_dividend(
        self,
        setup_all,
        session: AsyncSession,
        redis_client: Redis,
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
        
        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)
        
        dividend_map: dict[tuple[str, date], float] = {
            ("AAPL", date(2024, 8, 13)): 1.5,
            ("TSLA", date(2024, 8, 14)): 0.9,
            ("005930", date(2024, 8, 14)): 105.0,
            # Last year data for dividends
            ("AAPL", date(2023, 8, 13)): 1.4,
            ("AAPL", date(2023, 11, 14)): 1.5,
        }

        # When
        total_dividends = DividendFacade.get_full_month_estimate_dividend(
            assets=assets,
            exchange_rate_map=exchange_rate_map,
            dividend_map=dividend_map
        )
                
        # Then
        expected_total_dividends = {
            date(2024, 8, 13): (1.5 * 1300 * assets[0].asset_stock.quantity),
            date(2024, 8, 14): (0.9 * 1300 * assets[1].asset_stock.quantity) + (105.0 * assets[2].asset_stock.quantity),
            date(2024, 11, 14): 1.5 * 1300 * assets[0].asset_stock.quantity,
        }

        for dividend_date, expected_amount in expected_total_dividends.items():
            assert total_dividends[dividend_date] == approx(expected_amount)

