import asyncio
import logging
import os
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AccountType, AssetType, InvestmentBankType
from app.module.asset.model import Asset, Stock
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.stock_repository import StockRepository
from app.module.auth.constant import ADMIN_USER_ID, DUMMY_USER_ID
from app.module.auth.enum import ProviderEnum, UserRoleEnum
from app.module.auth.repository import UserRepository
from database.dependency import get_mysql_session

os.makedirs("./logs", exist_ok=True)

with open("./logs/insert_basic_data.log", "w"):
    pass

logging.basicConfig(
    filename="./logs/insert_basic_data.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("[insert_basic_data] 초기 데이터 추가를 시작 합니다.")


async def create_initial_users(session: AsyncSession):
    check_admin_user = await UserRepository.get(session, ADMIN_USER_ID)
    check_dummy_user = await UserRepository.get(session, DUMMY_USER_ID)

    if check_admin_user and check_dummy_user:
        return False

    if check_admin_user is None:
        await UserRepository.create(
            db=session,
            user_id=ADMIN_USER_ID,
            social_id="admin_social_id",
            provider=ProviderEnum.GOOGLE,
            role=UserRoleEnum.ADMIN,
            nickname="admin_user",
        )

    if check_dummy_user is None:
        await UserRepository.create(
            db=session,
            user_id=DUMMY_USER_ID,
            social_id="dummy_social_id",
            provider=ProviderEnum.GOOGLE,
            nickname="dummy_user",
        )

    logging.info("[create_initial_users] 성공적으로 admin과 더미 유저를 생성 했습니다.")

    return True


async def create_dummy_assets(session: AsyncSession):
    stock_codes = ["005930", "AAPL", "7203", "446720"]  # 삼성전자, 애플, 토요타, etf sol 다우존스
    purchase_dates = [date(2021, 1, 1), date(2022, 2, 2), date(2023, 3, 3), date(2024, 4, 4)]

    stock_list: list[Stock] = await StockRepository.get_by_codes(session, stock_codes)

    assets: list[Asset] = [
        Asset(
            quantity=10,
            investment_bank=InvestmentBankType.TOSS,
            account_type=AccountType.REGULAR,
            asset_type=AssetType.STOCK,
            purchase_date=purchase_date,
            user_id=DUMMY_USER_ID,
        )
        for purchase_date in purchase_dates
    ]

    for stock, asset in zip(stock_list, assets):
        asset.stock.append(stock)

    success = await AssetRepository.save_assets(session, assets)
    if success:
        logging.info("[create_dummy_assets] 더미 유저에 assets을 성공적으로 생성 했습니다.")
    else:
        logging.info("[create_dummy_assets] 더미 유저에 assets을 생성하는데 실패 하였습니다.")


async def main():
    async with get_mysql_session() as session:
        created = await create_initial_users(session)
        if created:
            await create_dummy_assets(session)


if __name__ == "__main__":
    asyncio.run(main())
