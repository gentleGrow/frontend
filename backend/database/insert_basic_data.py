import logging
import os

from sqlalchemy import create_engine, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker

from app.module.asset.enum import AccountType, AssetType, InvestmentBankType
from app.module.asset.model import Asset, Stock, asset_stock  # noqa > relationship purpose
from app.module.auth.constant import ADMIN_USER_ID, DUMMY_USER_ID
from app.module.auth.enum import ProviderEnum, UserRoleEnum
from app.module.auth.model import User  # noqa > relationship purpose
from database.config import MYSQL_URL

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/insert_basic_data.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("[insert_basic_data] 초기 데이터 추가를 시작 합니다.")

if MYSQL_URL is not None:
    sync_mysql_url = MYSQL_URL.replace("mysql+aiomysql", "mysql+mysqlconnector")
    logging.info(f"[insert_basic_data] Converted MYSQL_URL: {sync_mysql_url}")

    try:
        sync_engine = create_engine(sync_mysql_url)
        Session = sessionmaker(bind=sync_engine)
        session = Session()

        check_admin_user = session.execute(select(User).filter(User.id == ADMIN_USER_ID)).scalar_one_or_none()
        check_dummy_user = session.execute(select(User).filter(User.id == DUMMY_USER_ID)).scalar_one_or_none()

        if check_admin_user and check_dummy_user:
            logging.info("[insert_basic_data] 이미 유저가 생성 되어 있습니다.")
        else:
            if check_admin_user is None:
                admin_user = User(
                    id=ADMIN_USER_ID,
                    social_id="admin_social_id",
                    provider=ProviderEnum.GOOGLE,
                    role=UserRoleEnum.ADMIN,
                    nickname="admin_user",
                )
                session.add(admin_user)

            if check_dummy_user is None:
                dummy_user = User(
                    id=DUMMY_USER_ID,
                    social_id="dummy_social_id",
                    provider=ProviderEnum.GOOGLE,
                    nickname="dummy_user",
                )
                session.add(dummy_user)

        session.commit()
        logging.info("[insert_basic_data] 성공적으로 admin과 더미 유저를 생성 했습니다.")

        stock_codes = ["005930", "AAPL", "7203", "446720"]
        stock_names = ["삼성전자", "애플", "토요타자동차", "SOL 미국배당다우존스"]
        market_indices = ["KOSPI", "NASDAQ", "TSE", "1"]

        stocks = []
        for code, name, index in zip(stock_codes, stock_names, market_indices):
            stock = Stock(code=code, name=name, market_index=index)
            stocks.append(stock)

        assets = []
        for stock in stocks:
            asset = Asset(
                quantity=10,
                investment_bank=InvestmentBankType.TOSS,
                account_type=AccountType.REGULAR,
                asset_type=AssetType.STOCK,
                user_id=DUMMY_USER_ID,
            )
            asset.stocks.append(stock)
            assets.append(asset)

        session.add_all(assets)
        session.commit()
        logging.info("[insert_basic_data] 더미 유저에 assets을 성공적으로 생성 했습니다.")
    except SQLAlchemyError as e:
        session.rollback()
        logging.error(f"[insert_basic_data] SQLAlchemyError: {e}")
    except Exception as e:
        session.rollback()
        logging.error(f"[insert_basic_data] Unexpected error: {e}")
    finally:
        session.close()
else:
    logging.error(f"[insert_basic_data] SQL URL is not defined, {MYSQL_URL=}")
