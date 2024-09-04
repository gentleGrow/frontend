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

class ProfitStatus(StrEnum):
    PLUS = 'PLUS'
    MINUS = 'MINUS'


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


COUNTRY_TRANSLATIONS = {
    "미국": Country.USA,
    "일본": Country.JAPAN,
    "영국": Country.UK,
    "독일": Country.GERMANY,
    "프랑스": Country.FRANCE,
    "중국": Country.CHINA,
    "홍콩": Country.HONGKONG,
    "캐나다": Country.CANADA,
    "호주": Country.AUSTRALIA,
    "인도": Country.INDIA,
    "브라질": Country.BRAZIL,
    "러시아": Country.RUSSIA,
    "이탈리아": Country.ITALY,
    "스페인": Country.SPAIN,
    "스위스": Country.SWITZERLAND,
    "네덜란드": Country.NETHERLAND,
    "유로존": Country.EUROZONE,
    "한국": Country.KOREA,  
}


INDEX_NAME_TRANSLATIONS = {
    "다우 산업": "DJI",  # Dow Jones Industrial Average
    "다우 운송": "DJT",  # Dow Jones Transportation Average
    "나스닥 종합": "IXIC",  # Nasdaq Composite
    "나스닥 100": "NDX",  # Nasdaq 100
    "S&P 500": "SPX",  # S&P 500
    "필라델피아 반도체": "SOX",  # Philadelphia Semiconductor Index
    "브라질 BOVESPA": "BVSP",  # Brazil Bovespa
    "상해종합": "000001.SS",  # Shanghai Composite
    "상해 A": "000002.SS",  # Shanghai A Shares
    "상해 B": "000003.SS",  # Shanghai B Shares
    "니케이225": "N225",  # Nikkei 225
    "항셍": "HSI",  # Hang Seng Index
    "항셍 차이나기업(H)": "HSCE",  # Hang Seng China Enterprises (H Shares)
    "항셍 차이나대기업(R)": "HSCE",  # Hang Seng China Enterprises (R Shares)
    "대만 가권": "TWII",  # Taiwan Weighted Index
    "인도 SENSEX": "SENSEX",  # India Sensex
    "말레이시아 KLCI": "KLSE",  # Malaysia KLCI
    "인도네시아 IDX종합": "JKSE",  # Indonesia Composite Index
    "영국 FTSE 100": "FTSE",  # UK FTSE 100
    "프랑스 CAC 40": "FCHI",  # France CAC 40
    "독일 DAX": "GDAXI",  # Germany DAX
    "유로스톡스 50": "STOXX50E",  # Euro Stoxx 50
    "러시아 RTS": "RTSI",  # Russia RTS Index
    "이탈리아 FTSE MIB": "FTMIB",  # Italy FTSE MIB
}


class MarketIndex(StrEnum):
    NYSE = "NYSE"
    NASDAQ = "NASDAQ"
    DJIA = "DJIA"
    IXIC = "IXIC"
    N225 = "N225"
    FTSE = "FTSE"
    DAX = "DAX"
    PX1 = "PX1"
    SHCOMP = "SHCOMP"
    HSI = "HSI"
    GSPTSE = "GSPTSE"
    AXJO = "AXJO"
    NSEI = "NSEI"
    KS11 = "KS11"
    BVSP = "BVSP"
    IMOEX = "IMOEX"
    FTSEMIB = "FTSEMIB"
    IBEX = "IBEX"
    SMI = "SMI"
    AEX = "AEX"
    TSE = "TSE"
    SX5E = "SX5E"
    KOSPI = "KOSPI"
    KOSDAQ = "KOSDAQ"


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
