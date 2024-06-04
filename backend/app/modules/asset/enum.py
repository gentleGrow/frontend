from enum import StrEnum


class AssetType(StrEnum):
    STOCK = "stock"
    BOND = "bond"
    VIRTUAL_ASSET = "virtual_asset"
    CURRENCY = "currency"
    OTHER = "other"


class VirtualExchangeType(StrEnum):
    UPBIT = "upbit"
    BITHUMB = "bithumb"
    BINANCE = "binance"
    WALLET = "wallet"


class CurrencyType(StrEnum):
    KRW = "won"
    USD = "dollar"
    JPY = "yen"
