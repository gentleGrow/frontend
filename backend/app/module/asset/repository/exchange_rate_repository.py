from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import ExchangeRate


class ExchangeRateRepository:
    @staticmethod
    async def save(session: AsyncSession, exchange_rate: ExchangeRate) -> None:
        session.add(exchange_rate)
        await session.commit()
