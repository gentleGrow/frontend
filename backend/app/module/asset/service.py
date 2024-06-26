from app.module.asset.constant import COUNTRY_TO_CURRENCY
from app.module.asset.enum import CurrencyType


def get_currency_code(country_name: str) -> CurrencyType | None:
    normalized_country = country_name.upper()
    return COUNTRY_TO_CURRENCY.get(normalized_country, None)
