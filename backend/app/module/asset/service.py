from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.constant import COUNTRY_TO_CURRENCY
from app.module.asset.enum import CurrencyType
from app.module.asset.model import ExchangeRate
from app.module.asset.repository.exchange_rate_repository import ExchangeRateRepository


def get_currency_code(country_name: str) -> CurrencyType | None:
    normalized_country = country_name.upper()
    return COUNTRY_TO_CURRENCY.get(normalized_country, None)


async def get_exchange_rate_to_won(session: AsyncSession, source_country: str) -> float:
    source_currency: CurrencyType | None = get_currency_code(source_country)
    target_currency: CurrencyType = CurrencyType.KOREA
    if source_currency == target_currency:
        result = 1
    else:
        exchange_rate: ExchangeRate = await ExchangeRateRepository.get_by_source_target(
            session, source_currency, target_currency
        )
        result = exchange_rate.rate

    return result
