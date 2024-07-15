from app.module.asset.enum import CurrencyType

REDIS_STOCK_EXPIRE_SECOND = 60 * 60 * 24
DUMMY_ASSET_EXPIRE_SECOND = 60 * 60
DUMMY_ASSET_KOREA_KEY = "dummy_asset_korea"
DUMMY_ASSET_OTHER_KEY = "dummy_asset_other"

COUNTRY_TO_CURRENCY = {
    "KOREA": CurrencyType.KOREA,
    "USA": CurrencyType.USA,
    "JAPAN": CurrencyType.JAPAN,
    "AUSTRALIA": CurrencyType.AUSTRALIA,
    "BRAZIL": CurrencyType.BRAZIL,
    "CANADA": CurrencyType.CANADA,
    "CHINA": CurrencyType.CHINA,
    "EUROPE": CurrencyType.EUROPE,
    "HONG KONG": CurrencyType.HONG_KONG,
    "INDIA": CurrencyType.INDIA,
    "SWITZERLAND": CurrencyType.SWITZERLAND,
    "UNITED KINGDOM": CurrencyType.UNITED_KINGDOM,
}
