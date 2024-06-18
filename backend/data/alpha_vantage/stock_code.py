import pandas as pd
import requests

API_KEY = "28NXXDQ2CZ2L8AZL"  # Replace with your actual API key

# Predefined lists of major indices for each country
country_indices = {
    "france": ["^FCHI"],  # CAC 40
    "china": ["000001.SS"],  # SSE Composite
    "germany": ["^GDAXI"],  # DAX
    "italy": ["FTSEMIB.MI"],  # FTSE MIB
    "india": ["^BSESN"],  # BSE Sensex
}


def get_constituents(index_symbol):
    constituents = {
        "^FCHI": ["AC.PA", "AI.PA", "AIR.PA", "MT.PA", "ATO.PA"],
        "000001.SS": ["600519.SS", "601318.SS", "601888.SS", "601857.SS"],
        "^GDAXI": ["ADS.DE", "ALV.DE", "BAS.DE", "BAYN.DE"],
        "FTSEMIB.MI": ["ENI.MI", "ISP.MI", "UCG.MI", "G.MI"],
        "^BSESN": ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS"],
    }
    return constituents.get(index_symbol, [])


def get_stock_info(symbol):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={symbol}&apikey={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        meta_data = data.get("Meta Data", {})
        time_series = data.get("Time Series (Daily)", {})
        if time_series:
            latest_date = list(time_series.keys())[0]
            latest_data = time_series[latest_date]
            return {
                "symbol": symbol,
                "name": meta_data.get("2. Symbol", "N/A"),
                "date": latest_date,
                "open": latest_data.get("1. open", "N/A"),
                "high": latest_data.get("2. high", "N/A"),
                "low": latest_data.get("3. low", "N/A"),
                "close": latest_data.get("4. close", "N/A"),
                "adjusted_close": latest_data.get("5. adjusted close", "N/A"),
                "volume": latest_data.get("6. volume", "N/A"),
            }
    return None


def fetch_stock_data():
    for country, indices in country_indices.items():
        stock_symbols = []

        for index_symbol in indices:
            # Fetch the constituents of the index (you need a list of constituents for the index)
            constituents = get_constituents(index_symbol)

            if not constituents:
                continue

            for symbol in constituents:
                stock_info = get_stock_info(symbol)
                if stock_info:
                    stock_symbols.append(stock_info)

        # Create a DataFrame and save it to an Excel file
        df = pd.DataFrame(stock_symbols)
        df.to_excel(f"{country}_stock_list.xlsx", index=False)
        print(f"Stock data for {country} fetched and saved to {country}_stock_list.xlsx")
