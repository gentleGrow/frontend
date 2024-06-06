import logging
import os

from sqlalchemy import create_engine, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.module.asset.enum import AccountType, AssetType, InvestmentBankType
from app.module.asset.model import Asset, Stock, asset_stock  # noqa > relationship purpose
from app.module.auth.constant import DUMMY_USER_ID
from app.module.auth.model import User  # noqa > relationship purpose
from database.config import MYSQL_URL

Base = declarative_base()

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/insert_basic_data.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("[insert_basic_data] Starting the data insertion process.")

if MYSQL_URL is not None:
    sync_mysql_url = MYSQL_URL.replace("mysql+aiomysql", "mysql+mysqlconnector")
    logging.info(f"[insert_basic_data] Converted MYSQL_URL: {sync_mysql_url}")

    try:
        logging.info("[insert_basic_data] Creating sync engine.")
        sync_engine = create_engine(sync_mysql_url)
        Session = sessionmaker(bind=sync_engine)
        session = Session()
        logging.info("[insert_basic_data] Sync engine created and session established.")

        logging.info("[insert_basic_data] Checking if dummy user exists.")
        existing_user = session.execute(select(User).filter(User.id == DUMMY_USER_ID)).scalar_one_or_none()

        if existing_user:
            logging.info("[insert_basic_data] Dummy user already exists. No action taken.")
        else:
            logging.info("[insert_basic_data] Dummy user not found. Creating dummy user.")
            dummy_user = User(
                id=DUMMY_USER_ID,
                social_id="dummy_social_id",
                provider="dummy_provider",
                nickname="Dummy User",
            )
            session.add(dummy_user)
            session.commit()
            logging.info("[insert_basic_data] Dummy user created successfully.")

        stock_codes = ["005930", "AAPL", "7203"]
        stock_names = ["Samsung Electronics", "Apple Inc.", "Toyota Motor Corporation"]
        market_indices = ["KOSPI", "NASDAQ", "TSE"]

        stocks = []
        for code, name, index in zip(stock_codes, stock_names, market_indices):
            stock = session.execute(select(Stock).filter(Stock.code == code)).scalar_one_or_none()
            if stock is None:
                stock = Stock(code=code, name=name, market_index=index)
                session.add(stock)
                session.commit()
                logging.info(f"[insert_basic_data] Added stock: {name}")
            stocks.append(stock)

        assets = []
        for stock in stocks:
            asset = Asset(
                quantity=100,
                investment_bank=InvestmentBankType.TOSS,
                account_type=AccountType.REGULAR,
                asset_type=AssetType.STOCK,
                user_id=DUMMY_USER_ID,
            )
            asset.stocks.append(stock)
            assets.append(asset)

        session.add_all(assets)
        session.commit()
        logging.info("[insert_basic_data] Assets for dummy user created successfully.")
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"[insert_basic_data] SQLAlchemyError: {e}")
    except Exception as e:
        session.rollback()
        logging.error(f"[insert_basic_data] Unexpected error: {e}")
    finally:
        session.close()
        logging.info("[insert_basic_data] Session closed.")
else:
    logging.error(f"[insert_basic_data] SQL URL is not defined, {MYSQL_URL=}")

logging.info("[insert_basic_data] Finished the data insertion process.")
