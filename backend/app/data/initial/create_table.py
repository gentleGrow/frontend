import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

from app.module.asset.model import (  # noqa > relationship purpose
    Asset,
    Bond,
    Currency,
    Dividend,
    Stock,
    StockDaily,
    StockMonthly,
    StockRealtime,
    StockWeekly,
    VirtualAsset,
)
from app.module.auth.model import User  # noqa > relationship purpose
from database.config import MYSQL_URL, MySQLBase

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/create_stock.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("[create_tables] 테이블 생성을 시도 합니다.")

if MYSQL_URL is not None:
    sync_mysql_url = MYSQL_URL.replace("mysql+aiomysql", "mysql+mysqlconnector")

    try:
        sync_engine = create_engine(sync_mysql_url)
        MySQLBase.metadata.create_all(sync_engine)
        logging.info("[create_tables] 성공적으로 테이블을 생성하였습니다.")
    except SQLAlchemyError as e:
        logging.error(f"[create_tables] SQLAlchemyError: {e}")
    except Exception as e:
        logging.error(f"[create_tables] Unexpected error: {e}")
else:
    logging.error(f"[create_tables] MYSQL_URL가 정의 되어 있지 않습니다., {MYSQL_URL=}")
