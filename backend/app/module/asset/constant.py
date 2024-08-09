from app.module.asset.enum import CurrencyType

REDIS_STOCK_EXPIRE_SECOND = 60 * 60 * 24
DUMMY_ASSET_EXPIRE_SECOND = 60 * 60
DUMMY_ASSET_KOREA_KEY = "dummy_asset_korea"
DUMMY_ASSET_FOREIGN_KEY = "dummy_asset_foreign"

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


currency_pairs = [
    (CurrencyType.USA, CurrencyType.KOREA),
    (CurrencyType.JAPAN, CurrencyType.KOREA),
    (CurrencyType.AUSTRALIA, CurrencyType.KOREA),
    (CurrencyType.BRAZIL, CurrencyType.KOREA),
    (CurrencyType.CANADA, CurrencyType.KOREA),
    (CurrencyType.CHINA, CurrencyType.KOREA),
    (CurrencyType.EUROPE, CurrencyType.KOREA),
    (CurrencyType.HONG_KONG, CurrencyType.KOREA),
    (CurrencyType.INDIA, CurrencyType.KOREA),
    (CurrencyType.SWITZERLAND, CurrencyType.KOREA),
    (CurrencyType.UNITED_KINGDOM, CurrencyType.KOREA),
    (CurrencyType.KOREA, CurrencyType.USA),
    (CurrencyType.JAPAN, CurrencyType.USA),
    (CurrencyType.AUSTRALIA, CurrencyType.USA),
    (CurrencyType.BRAZIL, CurrencyType.USA),
    (CurrencyType.CANADA, CurrencyType.USA),
    (CurrencyType.CHINA, CurrencyType.USA),
    (CurrencyType.EUROPE, CurrencyType.USA),
    (CurrencyType.HONG_KONG, CurrencyType.USA),
    (CurrencyType.INDIA, CurrencyType.USA),
    (CurrencyType.SWITZERLAND, CurrencyType.USA),
    (CurrencyType.UNITED_KINGDOM, CurrencyType.USA),
]
