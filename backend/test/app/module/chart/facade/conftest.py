from test.fixtures.asset.test_asset_fixture import (  # noqa: F401 test fixture 사용
    setup_all,
    setup_asset,
    setup_asset_field,
    setup_asset_stock_field,
    setup_current_market_index,
    setup_dividend,
    setup_exchange_rate,
    setup_market_index_daily,
    setup_market_index_minutely_data,
    setup_realtime_stock_price,
    setup_stock,
    setup_stock_daily,
    setup_user,
)
from test.fixtures.chart.test_asset_fixture import (  # noqa: F401 > relationship 설정시 필요합니다.
    setup_current_index,
    setup_market_index_minutely,
    setup_rich_portfolio,
    setup_tip,
)
