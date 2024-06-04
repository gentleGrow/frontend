from app.modules.asset.model import StockDaily, StockMonthly, StockWeekly
from data.yahoo.sources.enums import TimeInterval

STOCK_TIME_INTERVAL = "1d"
STOCK_HISTORY_TIMERANGE_YEAR = 1


TIME_INTERVAL_MODEL_REPO_MAP = {
    TimeInterval.DAY: StockDaily,
    TimeInterval.WEEK: StockWeekly,
    TimeInterval.MONTH: StockMonthly,
}
