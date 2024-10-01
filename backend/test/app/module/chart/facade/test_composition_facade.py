from pytest import approx
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from app.module.asset.model import Asset
from app.module.chart.facade.composition_facade import CompositionFacade
from app.module.auth.constant import DUMMY_USER_ID
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.enum import AssetType
from icecream import ic
from app.module.asset.services.exchange_rate_service import ExchangeRateService

class TestCompositionFacade:
    async def test_get_asset_stock_composition(
        self,
        setup_all,
        session: AsyncSession,
        redis_client: Redis,
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
        
        current_stock_price_map = {
            "AAPL": 150.0,   
            "TSLA": 720.0,   
            "005930": 70000.0 
        }
        
        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)

        # When
        result = CompositionFacade.get_asset_stock_composition(
            assets=assets,
            current_stock_price_map=current_stock_price_map,
            exchange_rate_map=exchange_rate_map
        )

        # Then
        expected_result = [
            {
                "name": "Tesla Inc.",
                "percent_rate": approx((2 * 720 * exchange_rate_map["USD_KRW"]) / (2 * 720 * exchange_rate_map["USD_KRW"] + 1 * 150 * exchange_rate_map["USD_KRW"] + 1 * 70000) * 100, rel=1e-2),
                "current_amount": approx(2 * 720 * exchange_rate_map["USD_KRW"], rel=1e-2)
            },
            {
                "name": "Apple Inc.",
                "percent_rate": approx((1 * 150 * exchange_rate_map["USD_KRW"]) / (2 * 720 * exchange_rate_map["USD_KRW"] + 1 * 150 * exchange_rate_map["USD_KRW"] + 1 * 70000) * 100, rel=1e-2),
                "current_amount": approx(1 * 150 * exchange_rate_map["USD_KRW"], rel=1e-2)
            },
            {
                "name": "삼성전자",
                "percent_rate": approx((1 * 70000) / (2 * 720 * exchange_rate_map["USD_KRW"] + 1 * 150 * exchange_rate_map["USD_KRW"] + 1 * 70000) * 100, rel=1e-2),
                "current_amount": approx(1 * 70000, rel=1e-2)
            }
        ]


        for res, expected in zip(result, expected_result):
            assert res["name"] == expected["name"]
            assert res["percent_rate"] == expected["percent_rate"]
            assert res["current_amount"] == expected["current_amount"]


    async def test_get_asset_stock_account(
        self,
        setup_all,
        session: AsyncSession,
        redis_client: Redis,
    ):
        # Given
        assets: list[Asset] = await AssetRepository.get_eager(session, DUMMY_USER_ID, AssetType.STOCK)
        
        current_stock_price_map = {
            "AAPL": 150.0,   
            "TSLA": 720.0,   
            "005930": 70000.0 
        }
        
        exchange_rate_map: dict[str, float] = await ExchangeRateService.get_exchange_rate_map(redis_client)

        # When
        result = CompositionFacade.get_asset_stock_account(
            assets=assets,
            current_stock_price_map=current_stock_price_map,
            exchange_rate_map=exchange_rate_map
        )

        # Then
        expected_result = [
            {
                "name": "개인연금",  
                "percent_rate": approx((2 * 720 * exchange_rate_map["USD_KRW"]) / (1 * 150 * exchange_rate_map["USD_KRW"] + 2 * 720 * exchange_rate_map["USD_KRW"] + 1 * 70000) * 100, rel=1e-2),
                "current_amount": approx(2 * 720 * exchange_rate_map["USD_KRW"], rel=1e-2)
            },
            {
                "name": "ISA", 
                "percent_rate": approx((1 * 150 * exchange_rate_map["USD_KRW"]) / (1 * 150 * exchange_rate_map["USD_KRW"] + 2 * 720 * exchange_rate_map["USD_KRW"] + 1 * 70000) * 100, rel=1e-2),
                "current_amount": approx(1 * 150 * exchange_rate_map["USD_KRW"], rel=1e-2)
            },
            {
                "name": "일반계좌",  
                "percent_rate": approx((1 * 70000) / (1 * 150 * exchange_rate_map["USD_KRW"] + 2 * 720 * exchange_rate_map["USD_KRW"] + 1 * 70000) * 100, rel=1e-2),
                "current_amount": approx(1 * 70000, rel=1e-2)
            }
        ]

        for res, expected in zip(result, expected_result):
            assert res["name"] == expected["name"]
            assert res["percent_rate"] == expected["percent_rate"]
            assert res["current_amount"] == expected["current_amount"]