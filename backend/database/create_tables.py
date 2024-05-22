from sqlalchemy import create_engine

from app.common.utils.logging import logging
from app.modules.asset_management.models import (  # noqa: F401 > table 생성 시 필요합니다.
    Stock,
    StockDaily,
    StockMonthly,
    StockTransaction,
    StockWeekly,
)
from app.modules.auth.models import User  # noqa: F401 > table 생성 시 필요합니다.
from database.config import MYSQL_URL, MySQLBase

if MYSQL_URL is not None:
    sync_mysql_url = MYSQL_URL.replace("mysql+aiomysql", "mysql+mysqlconnector")
    sync_engine = create_engine(sync_mysql_url)

    MySQLBase.metadata.create_all(sync_engine)

    logging.info("[create_tables] 테이블이 성공적으로 생성되었습니다.")
else:
    logging.error(f"[create_tables] SQL URL을 확인해주세요, {MYSQL_URL=}")
