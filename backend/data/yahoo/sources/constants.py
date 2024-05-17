from app.modules.asset_management.models import StockDaily, StockMonthly, StockWeekly
from data.common.repository import StockDailyRepository, StockMonthlyRepository, StockWeeklyRepository
from data.yahoo.sources.enums import TimeInterval

STOCK_TIME_INTERVAL = "1d"
STOCK_HISTORY_TIMERANGE_YEAR = 1


TIME_INTERVAL_MODEL_REPO_MAP = {
    TimeInterval.day: (StockDaily, StockDailyRepository),
    TimeInterval.week: (StockWeekly, StockWeeklyRepository),
    TimeInterval.month: (StockMonthly, StockMonthlyRepository),
}
