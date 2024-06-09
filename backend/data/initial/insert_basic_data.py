import asyncio
import logging
import os

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.module.asset.enum import AccountType, AssetType, InvestmentBankType
from app.module.asset.model import Asset, Stock
from app.module.asset.repository.stock_repository import StockRepository
from app.module.asset.schema.stock_schema import StockCode, StockCodeList, StockList
from app.module.auth.constant import ADMIN_USER_ID, DUMMY_USER_ID
from app.module.auth.enum import ProviderEnum, UserRoleEnum
from app.module.auth.model import User
from database.config import MYSQL_URL

os.makedirs("./logs", exist_ok=True)

with open("./logs/insert_basic_data.log", "w"):
    pass

logging.basicConfig(
    filename="./logs/insert_basic_data.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("[insert_basic_data] 초기 데이터 추가를 시작 합니다.")


async def create_initial_users(session: AsyncSession):
    try:
        check_admin_user = (await session.execute(select(User).filter(User.id == ADMIN_USER_ID))).scalar_one_or_none()
        check_dummy_user = (await session.execute(select(User).filter(User.id == DUMMY_USER_ID))).scalar_one_or_none()

        if not check_admin_user:
            admin_user = User(
                id=ADMIN_USER_ID,
                social_id="admin_social_id",
                provider=ProviderEnum.GOOGLE,
                role=UserRoleEnum.ADMIN,
                nickname="admin_user",
            )
            session.add(admin_user)

        if not check_dummy_user:
            dummy_user = User(
                id=DUMMY_USER_ID,
                social_id="dummy_social_id",
                provider=ProviderEnum.GOOGLE,
                nickname="dummy_user",
            )
            session.add(dummy_user)

        await session.commit()
        logging.info("[create_initial_users] 성공적으로 admin과 더미 유저를 생성 했습니다.")
    except SQLAlchemyError as e:
        await session.rollback()
        logging.error(f"[create_initial_users] SQLAlchemyError: {e}")
    except Exception as e:
        await session.rollback()
        logging.error(f"[create_initial_users] Unexpected error: {e}")


async def create_dummy_assets(session: AsyncSession):
    try:
        stock_codes = ["005930", "AAPL", "7203", "446720"]  # 삼성전자, 애플, 토요타, etf sol 다우존스
        stock_code_list = StockCodeList(codes=[StockCode(code=code) for code in stock_codes])

        stock_list: StockList = await StockRepository.get_stocks_by_codes(session, stock_code_list)

        stocks = await session.execute(select(Stock).where(Stock.code.in_([stock.code for stock in stock_list.stocks])))
        stock_objects = stocks.scalars().all()

        assets = []
        for stock in stock_objects:
            asset = Asset(
                quantity=10,
                investment_bank=InvestmentBankType.TOSS,
                account_type=AccountType.REGULAR,
                asset_type=AssetType.STOCK,
                user_id=DUMMY_USER_ID,
            )
            asset.stock.append(stock)
            assets.append(asset)

        session.add_all(assets)
        await session.commit()
        logging.info("[create_dummy_assets] 더미 유저에 assets을 성공적으로 생성 했습니다.")
    except SQLAlchemyError as e:
        await session.rollback()
        logging.error(f"[create_dummy_assets] SQLAlchemyError: {e}")
    except Exception as e:
        await session.rollback()
        logging.error(f"[create_dummy_assets] Unexpected error: {e}")


async def main():
    async_engine = create_async_engine(MYSQL_URL)
    async_session = sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)

    try:
        async with async_session() as session:
            await create_initial_users(session)
            await create_dummy_assets(session)
    finally:
        await async_engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
