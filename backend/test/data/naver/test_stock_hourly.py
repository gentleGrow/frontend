from unittest.mock import AsyncMock, call, patch

import pytest

from data.common.enums import MarketType
from data.common.schemas import StockInfo, StockList, StockPrice, StockPriceList
from data.naver.stock_hourly import main

REDIS_STOCK_EXPIRE_SECOND = 60 * 60


@pytest.mark.asyncio
async def test_main():
    mock_stock_list = StockList(
        stocks=[
            StockInfo(code="AAPL", name="Apple Inc.", market_index="NASDAQ"),
            StockInfo(code="GOOG", name="Alphabet Inc.", market_index="NASDAQ"),
            StockInfo(code="MSFT", name="Microsoft Corp.", market_index="NASDAQ"),
        ]
    )

    mock_price_list_1 = StockPriceList(prices=[StockPrice(price=100), StockPrice(price=200)])

    mock_price_list_2 = StockPriceList(prices=[StockPrice(price=300)])

    with patch(
        "data.naver.stock_hourly.MARKET_TYPE_N_STOCK_CODE_FUNC_MAP", {MarketType.KOREA: lambda: mock_stock_list}
    ), patch("data.naver.stock_hourly.get_stock_prices", new_callable=AsyncMock) as mock_get_stock_prices, patch(
        "data.naver.stock_hourly.redis_stock_repository.save", new_callable=AsyncMock
    ) as mock_redis_save, patch(
        "data.naver.stock_hourly.STOCK_CHUNK_SIZE", 2
    ), patch(
        "app.modules.asset_management.constants.REDIS_STOCK_EXPIRE_SECOND", 60 * 60
    ), patch(
        "data.naver.stock_hourly.REDIS_STOCK_EXPIRE_SECOND", 60 * 60
    ):

        mock_get_stock_prices.side_effect = [mock_price_list_1, mock_price_list_2]

        await main(MarketType.KOREA)

        expected_calls = [
            call(
                StockList(
                    stocks=[
                        StockInfo(code="AAPL", name="Apple Inc.", market_index="NASDAQ"),
                        StockInfo(code="GOOG", name="Alphabet Inc.", market_index="NASDAQ"),
                    ]
                )
            ),
            call(StockList(stocks=[StockInfo(code="MSFT", name="Microsoft Corp.", market_index="NASDAQ")])),
        ]

        mock_get_stock_prices.return_value(expected_calls, any_order=False)

        expected_save_calls = [
            call(
                StockList(
                    stocks=[
                        StockInfo(code="AAPL", name="Apple Inc.", market_index="NASDAQ"),
                        StockInfo(code="GOOG", name="Alphabet Inc.", market_index="NASDAQ"),
                    ]
                ),
                mock_price_list_1,
                REDIS_STOCK_EXPIRE_SECOND,
            ),
            call(
                StockList(stocks=[StockInfo(code="MSFT", name="Microsoft Corp.", market_index="NASDAQ")]),
                mock_price_list_2,
                REDIS_STOCK_EXPIRE_SECOND,
            ),
        ]

        mock_redis_save.assert_has_calls(expected_save_calls, any_order=False)
