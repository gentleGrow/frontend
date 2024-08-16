from app.module.asset.enum import TimeInterval
from app.module.asset.model import StockDaily, StockMonthly, StockWeekly

STOCK_SCHEDULE_INTERVAL = "7d"
STOCK_TIME_INTERVAL = "1d"
STOCK_HISTORY_TIMERANGE_YEAR = 15
BATCH_SIZE = 100

DAY = "1d"


TIME_INTERVAL_MODEL_REPO_MAP = {
    TimeInterval.DAY: StockDaily,
    TimeInterval.WEEK: StockWeekly,
    TimeInterval.MONTH: StockMonthly,
}
