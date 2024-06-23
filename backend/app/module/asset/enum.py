from enum import StrEnum


class InvestmentBankType(StrEnum):
    TOSS = "토스증권"
    MIRAEASSET = "미래에셋증권"
    SAMSUNGINVESTMENT = "삼성투자증권"
    KOREAINVESTMENT = "한국투자증권"
    KB = "KB증권"
    DAISHIN = "대신증권"
    NH = "NH투자증권"
    SHINHANINVESTMENT = "신한투자증권"
    KIWOOM = "키움증권"


class AccountType(StrEnum):
    ISA = "ISA"
    IRP = "IRP"
    PENSION = "개인연금"
    REGULAR = "일반계좌"


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
    KOREA = "KRW"
    USA = "USD"
    JAPAN = "JPY"
    AUSTRALIA = "AUD"
    BRAZIL = "BRL"
    CANADA = "CAD"
    CHINA = "CNY"
    EUROPE = "EUR"
    HONG_KONG = "HKD"
    INDIA = "INR"
    SWITZERLAND = "CHF"
    UNITED_KINGDOM = "GBP"
