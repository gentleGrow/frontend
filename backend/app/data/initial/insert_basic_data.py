import asyncio
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.enum import AccountType, AssetType, InvestmentBankType
from app.module.asset.model import Asset, Stock
from app.module.asset.repository.asset_repository import AssetRepository
from app.module.asset.repository.stock_repository import StockRepository
from app.module.auth.constant import ADMIN_USER_ID, DUMMY_USER_ID
from app.module.auth.enum import ProviderEnum, UserRoleEnum
from app.module.auth.model import User
from app.module.auth.repository import UserRepository
from database.dependency import get_mysql_session


async def create_initial_users(session: AsyncSession):
    check_admin_user = await UserRepository.get(session, ADMIN_USER_ID)
    check_dummy_user = await UserRepository.get(session, DUMMY_USER_ID)

    if check_admin_user and check_dummy_user:
        return False

    if check_admin_user is None:
        admin_user = User(
            id=ADMIN_USER_ID,
            social_id="admin_social_id",
            provider=ProviderEnum.GOOGLE,
            role=UserRoleEnum.ADMIN,
            nickname="admin_user",
        )
        await UserRepository.create(session, admin_user)

    if check_dummy_user is None:
        dummy_user = User(
            id=DUMMY_USER_ID,
            social_id="dummy_social_id",
            provider=ProviderEnum.GOOGLE,
            nickname="dummy_user",
        )

        await UserRepository.create(session, dummy_user)

    print("[create_initial_users] 성공적으로 admin과 더미 유저를 생성 했습니다.")

    return True


async def create_dummy_assets(session: AsyncSession):
    stock_codes = ["005930", "AAPL", "7203", "446720"]  # 삼성전자, 애플, 토요타, etf sol 다우존스
    purchase_dates = [date(2015, 7, 22), date(2012, 11, 14), date(2020, 6, 8), date(2024, 5, 28)]

    stock_list: list[Stock] = await StockRepository.get_by_codes(session, stock_codes)
    stock_dict = {stock.code: stock for stock in stock_list}

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

    for stock_code, asset in zip(stock_codes, assets):
        matching_stock = stock_dict.get(stock_code)
        asset.stock.append(matching_stock)

    success = await AssetRepository.save_assets(session, assets)
    if success:
        print("[create_dummy_assets] 더미 유저에 assets을 성공적으로 생성 했습니다.")
    else:
        print("[create_dummy_assets] 더미 유저에 assets을 생성하는데 실패 하였습니다.")


async def main():
    async with get_mysql_session() as session:
        try:
            await create_initial_users(session)
        except Exception as err:
            print(f"유저 생성 중 에러가 생겼습니다. {err=}")

        try:
            await create_dummy_assets(session)
        except Exception as err:
            print(f"dummy asset 생성 중 에러가 생겼습니다. {err=}")


if __name__ == "__main__":
    asyncio.run(main())
