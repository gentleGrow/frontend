from enum import StrEnum
from pydantic import Field

class MarketIndexName(StrEnum):
    KS11 = Field("KS11", description="KOSPI: Korea Composite Stock Price Index")
    IXIC = Field("IXIC", description="NASDAQ: NASDAQ Composite Index")
    SPX = Field("SPX", description="S&P 500: Standard & Poor's 500 Index")
    DJI = Field("DJI", description="Dow Jones Industrial Average")
    N225 = Field("N225", description="Nikkei 225: Nikkei Stock Average")
    FTSE = Field("FTSE", description="FTSE 100 Index: Financial Times Stock Exchange 100 Index")
    GDAXI = Field("GDAXI", description="DAX: Deutscher Aktienindex")
    FCHI = Field("FCHI", description="CAC 40: Cotation Assistée en Continu")
