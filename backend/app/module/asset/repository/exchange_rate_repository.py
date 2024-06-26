from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.asset.enum import CurrencyType
from app.module.asset.model import ExchangeRate


class ExchangeRateRepository:
    @staticmethod
    async def get_by_source_target(session: AsyncSession, source: CurrencyType, target: CurrencyType) -> ExchangeRate:
        result = await session.execute(
            select(ExchangeRate).where(ExchangeRate.source_currency == source, ExchangeRate.target_currency == target)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def save(session: AsyncSession, exchange_rate: ExchangeRate) -> None:
        session.add(exchange_rate)
        await session.commit()
