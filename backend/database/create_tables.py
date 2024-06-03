import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

from app.modules.asset.models import (  # noqa > relationship purpose
    AssetTransaction,
    Stock,
    StockDaily,
    StockMonthly,
    StockWeekly,
)
from app.modules.auth.models import User  # noqa > relationship purpose
from database.config import MYSQL_URL, MySQLBase

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/create_stock.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("[create_tables] Starting the table creation process.")

if MYSQL_URL is not None:
    logging.info(f"[create_tables] Using MYSQL_URL: {MYSQL_URL}")
    sync_mysql_url = MYSQL_URL.replace("mysql+aiomysql", "mysql+mysqlconnector")
    logging.info(f"[create_tables] Converted MYSQL_URL: {sync_mysql_url}")

    try:
        logging.info("[create_tables] Creating sync engine.")
        sync_engine = create_engine(sync_mysql_url)
        logging.info("[create_tables] Sync engine created. Creating tables.")
        MySQLBase.metadata.create_all(sync_engine)
        logging.info("[create_tables] Tables created successfully.")
    except SQLAlchemyError as e:
        logging.error(f"[create_tables] SQLAlchemyError: {e}")
    except Exception as e:
        logging.error(f"[create_tables] Unexpected error: {e}")
else:
    logging.error(f"[create_tables] SQL URL is not defined, {MYSQL_URL=}")

logging.info("[create_tables] Finished the table creation process.")
