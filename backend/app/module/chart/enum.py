from enum import StrEnum


class MarketIndexName(StrEnum):
    KS11 = "KOSPI"  # Korea Composite Stock Price Index
    IXIC = "NASDAQ"  # NASDAQ Composite Index
    SPX = "S&P 500"  # Standard & Poor's 500 Index
    DJI = "Dow Jones Industrial Average"
    N225 = "Nikkei 225"  # Nikkei Stock Average
    FTSE = "FTSE 100"  # Financial Times Stock Exchange 100 Index
    GDAXI = "DAX"  # Deutscher Aktienindex
    FCHI = "CAC 40"  # Cotation Assistée en Continu

    @property
    def description(self):
        descriptions = {
            "KS11": "KOSPI: Korea Composite Stock Price Index",
            "IXIC": "NASDAQ: NASDAQ Composite Index",
            "SPX": "S&P 500: Standard & Poor's 500 Index",
            "DJI": "Dow Jones Industrial Average",
            "N225": "Nikkei 225: Nikkei Stock Average",
            "FTSE": "FTSE 100 Index: Financial Times Stock Exchange 100 Index",
            "GDAXI": "DAX: Deutscher Aktienindex",
            "FCHI": "CAC 40: Cotation Assistée en Continu",
        }
        return descriptions[self.name]
