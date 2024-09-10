from datetime import date, timedelta

import holidays

from app.module.asset.enum import (
    AccountType,
    Country,
    CurrencyType,
    InvestmentBankType,
    MarketIndex,
    PurchaseCurrencyType,
)

kr_holidays = holidays.KR()
us_holidays = holidays.US()

today = date.today()
one_year_ago = today - timedelta(days=365)

PURCHASE_DATES = []
current_date = one_year_ago
while current_date <= today:
    if (
        current_date.weekday() < 5
        and current_date not in kr_holidays
        and current_date not in us_holidays
        and current_date not in [date(2024, 3, 29), date(2024, 5, 1)]
    ):
        PURCHASE_DATES.append(current_date)
    current_date += timedelta(days=1)

KOREAN_STOCK_CODES = [
    "005930",
    "000660",
    "051910",
    "035720",
]

USA_STOCK_CODES = ["AAPL", "MSFT", "AMZN", "GOOGL", "TSLA", "META", "NVDA"]

STOCK_CODES = (KOREAN_STOCK_CODES + USA_STOCK_CODES) * (len(PURCHASE_DATES) // 20 + 1)
STOCK_CODES = STOCK_CODES[: len(PURCHASE_DATES)]

INVESTMENT_BANKS = [
    InvestmentBankType.TOSS.value,
    InvestmentBankType.KB.value,
    InvestmentBankType.NH.value,
    InvestmentBankType.KIWOOM.value,
    InvestmentBankType.MIRAEASSET.value,
    None,
] * (len(PURCHASE_DATES) // 6 + 1)
INVESTMENT_BANKS = INVESTMENT_BANKS[: len(PURCHASE_DATES)]

ACCOUNT_TYPES = [
    AccountType.REGULAR.value,
    AccountType.REGULAR.value,
    AccountType.REGULAR.value,
    AccountType.ISA.value,
    AccountType.REGULAR.value,
    None,
] * (len(PURCHASE_DATES) // 6 + 1)
ACCOUNT_TYPES = ACCOUNT_TYPES[: len(PURCHASE_DATES)]

PURCHASECURRENCYTYPES = [
    PurchaseCurrencyType.KOREA.value,
    PurchaseCurrencyType.USA.value,
] * (len(PURCHASE_DATES) // 2 + 1)
PURCHASECURRENCYTYPES = PURCHASECURRENCYTYPES[: len(PURCHASE_DATES)]

STOCK_QUANTITIES = [i % 5 + 1 for i in range(len(PURCHASE_DATES))]


REDIS_STOCK_EXPIRE_SECOND = 60 * 60 * 24

MARKET_INDEX_KR_MAPPING = {
    "KS11": "코스피",
    "KQ11": "코스닥",
    "DJI": "다우존스",
    "IXIC": "나스닥",
    "GSPC": "S&P 500",
    "NYA": "NYSE 종합",
    "N225": "니케이 225",
    "FTSE": "FTSE 100",
    "DAX": "독일 DAX",
    "PX1": "프랑스 CAC 40",
    "000001.SS": "상하이 종합",
    "HSI": "항셍",
    "GSPTSE": "S&P TSX",
    "AXJO": "ASX 200",
    "NSEI": "Nifty 50",
    "BVSP": "브라질 Bovespa",
    "IMOEX": "모스크바",
    "FTSEMIB.MI": "FTSE MIB",
    "IBEX": "IBEX 35",
    "SMI": "스위스 SMI",
    "AEX": "네덜란드 AEX",
    "TSE": "TSE 300",
    "SX5E": "유로스톡스 50",
}


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

CURRENCY_PAIRS = [
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


INDEX_NAME_TRANSLATIONS = {
    "다우 산업": MarketIndex.DOW_JONES,  # Dow Jones Industrial Average
    "다우 운송": "DJT",  # Dow Jones Transportation Average (No equivalent in MarketIndex)
    "나스닥 종합": MarketIndex.NASDAQ,  # Nasdaq Composite
    "나스닥 100": "NDX",  # Nasdaq 100 (No equivalent in MarketIndex)
    "S&P 500": MarketIndex.SP500,  # S&P 500
    "필라델피아 반도체": "SOX",  # Philadelphia Semiconductor Index (No equivalent in MarketIndex)
    "브라질 BOVESPA": MarketIndex.BOVESPA,  # Brazil Bovespa
    "상해종합": MarketIndex.SHANGHAI,  # Shanghai Composite
    "상해 A": "000002.SS",  # Shanghai A Shares (No equivalent in MarketIndex)
    "상해 B": "000003.SS",  # Shanghai B Shares (No equivalent in MarketIndex)
    "니케이225": MarketIndex.NIKKEI_225,  # Nikkei 225
    "항셍": MarketIndex.HANG_SENG,  # Hang Seng Index
    "항셍 차이나기업(H)": "HSCE",  # Hang Seng China Enterprises (H Shares) (No equivalent in MarketIndex)
    "항셍 차이나대기업(R)": "HSCE",  # Hang Seng China Enterprises (R Shares) (No equivalent in MarketIndex)
    "대만 가권": MarketIndex.TSE_300,  # Taiwan Weighted Index (TSE 300)
    "인도 SENSEX": MarketIndex.NIFTY_50,  # Nifty 50 Index (closest equivalent)
    "말레이시아 KLCI": "KLSE",  # Malaysia KLCI (No equivalent in MarketIndex)
    "인도네시아 IDX종합": "JKSE",  # Indonesia Composite Index (No equivalent in MarketIndex)
    "영국 FTSE 100": MarketIndex.FTSE_100,  # UK FTSE 100
    "프랑스 CAC 40": MarketIndex.CAC_40,  # France CAC 40
    "독일 DAX": MarketIndex.DAX,  # Germany DAX
    "유로스톡스 50": MarketIndex.EURO_STOXX_50,  # Euro Stoxx 50
    "러시아 RTS": MarketIndex.MOSCOW,  # Moscow Exchange Index (closest equivalent)
    "이탈리아 FTSE MIB": MarketIndex.FTSE_MIB,  # Italy FTSE MIB
}


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
