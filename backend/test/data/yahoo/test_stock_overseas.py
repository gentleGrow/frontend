from unittest.mock import AsyncMock, patch

import pandas as pd
import pytest

from data.common.schemas import StockInfo, StockList
from data.yahoo.sources.repository import StockRepository
from data.yahoo.stock_overseas import main

TOTAL_CALL = 4
START_DATE = "2021-01-01"
END_DATE = "2021-01-02"
START_TIMESTAMP = 1609459200  # January 1, 2021
END_TIMESTAMP = 1609459200  # January 1, 2022


@pytest.mark.asyncio
async def test_main():
    with patch(
        "data.yahoo.stock_overseas.get_period_bounds", return_value=(START_TIMESTAMP, END_TIMESTAMP)
    ) as mock_get_period_bounds, patch(
        "data.yahoo.stock_overseas.get_oversea_stock_code_list",
        return_value=StockList(
            stocks=[
                StockInfo(code="AAPL", name="Apple Inc.", market_index="NASDAQ"),
                StockInfo(code="TSLA", name="Tesla Inc.", market_index="NASDAQ"),
            ]
        ),
    ) as mock_get_oversea_stock_code_list, patch(
        "data.yahoo.stock_overseas.pd.read_csv",
        return_value=pd.DataFrame(
            {
                "Date": [START_DATE, END_DATE],
                "Open": [100.0, 105.0],
                "High": [110.0, 115.0],
                "Low": [90.0, 95.0],
                "Close": [105.0, 110.0],
                "Adj Close": [105.0, 110.0],
                "Volume": [1000, 2000],
            }
        ),
    ) as mock_read_csv, patch.object(
        StockRepository, "save", new_callable=AsyncMock
    ) as mock_save:

        await main()

        assert mock_get_period_bounds.called
        assert mock_get_oversea_stock_code_list.called
        assert mock_read_csv.called
        assert mock_save.called

        assert mock_save.call_count == TOTAL_CALL
