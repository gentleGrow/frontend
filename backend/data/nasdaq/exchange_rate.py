import logging
import os

import nasdaqdatalink
from dotenv import find_dotenv, load_dotenv

from data.nasdaq.source.enum import CountryCode, CountryCurrency, DataSource

load_dotenv(find_dotenv())
NASDAQ_DATA_LINK_API_KEY = os.getenv("NASDAQ_DATA_LINK_API_KEY")
nasdaqdatalink.ApiConfig.api_key = NASDAQ_DATA_LINK_API_KEY

os.makedirs("./logs", exist_ok=True)

logging.basicConfig(
    filename="./logs/create_stock.log", level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)


def get_exchange_rate(dataset_code):
    data = nasdaqdatalink.get(dataset_code)
    return data["Value"].iloc[-1]


def main():
    datasets = {
        f"{CountryCurrency.USA}/{CountryCurrency.KOREA}": f"{DataSource.Federal_Reserve_Economic_Data}/{DataSource.DailyExchange}{CountryCode.KOREA}{CountryCode.USA}"
    }

    for pair, dataset_code in datasets.items():
        try:
            rate = get_exchange_rate(dataset_code)
            logging.info(f"[exchange_rate] {pair}: {rate}")
        except Exception as e:
            logging.error(f"Error fetching data for {pair}: {e}")


if __name__ == "__main__":
    main()
