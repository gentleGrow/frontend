from enum import StrEnum


class PurchaseCurrencyType(StrEnum):
    KOREA = "KRW"
    USA = "USD"


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



class TimeInterval(StrEnum):
    DAY = "1d"
    WEEK = "1wk"
    MONTH = "1mo"


class Country(StrEnum):
    USA = "USA"
    JAPAN = "JAPAN"
    UK = "UK"
    GERMANY = "GERMANY"
    FRANCE = "FRANCE"
    CHINA = "CHINA"
    HONGKONG = "HONGKONG"
    CANADA = "CANADA"
    AUSTRALIA = "AUSTRALIA"
    INDIA = "INDIA"
    BRAZIL = "BRAZIL"
    RUSSIA = "RUSSIA"
    ITALY = "ITALY"
    SPAIN = "SPAIN"
    SWITZERLAND = "SWITZERLAND"
    NETHERLAND = "NETHERLAND"
    EUROZONE = "EUROZONE"
    KOREA = "KOREA"


class MarketIndex(StrEnum):
    KOSPI = "KS11"  # KOSPI Index
    KOSDAQ = "KQ11"  # KOSDAQ Index
    DOW_JONES = "DJI"  # Dow Jones Industrial Average
    NASDAQ = "IXIC"  # Nasdaq Composite
    SP500 = "GSPC"  # S&P500
    NYSE_COMPOSITE = "NYA"  # NYSE Composite Index
    NIKKEI_225 = "N225"  # Nikkei 225
    FTSE_100 = "FTSE"  # FTSE 100 Index
    DAX = "DAX"  # DAX Index
    CAC_40 = "PX1"  # CAC 40 Index
    SHANGHAI = "000001.SS"  # Shanghai Composite Index
    HANG_SENG = "HSI"  # Hang Seng Index
    SP_TSX = "GSPTSE"  # S&P/TSX Composite Index
    ASX_200 = "AXJO"  # ASX 200 Index
    NIFTY_50 = "NSEI"  # Nifty 50 Index
    BOVESPA = "BVSP"  # Brazil Bovespa Index
    MOSCOW = "IMOEX"  # Moscow Exchange Index
    FTSE_MIB = "FTSEMIB.MI"  # FTSE MIB Index
    IBEX_35 = "IBEX"  # IBEX 35 Index
    SWISS_MARKET_INDEX = "SMI"  # Swiss Market Index
    AEX = "AEX"  # AEX Index
    TSE_300 = "TSE"  # TSE 300 Index
    EURO_STOXX_50 = "SX5E"  # EURO STOXX 50 Index


class CountryMarketCode(StrEnum):
    USA = ""
    KOREA_KOSPI = "KS"
    KOREA_KOSDAQ = "KQ"
    JAPAN = "T"
    UK = "L"
    GERMANY = "DE"
    FRANCE = "PA"
    CHINA = "SS"
    HONGKONG = "HK"
    CANADA = "TO"
    AUSTRALIA = "AX"
    INDIA = "BO"
    BRAZIL = "SA"
    ITALY = "MI"
    SPAIN = "MC"
    SWITZERLAND = "SW"
    NETHERLAND = "AS"
