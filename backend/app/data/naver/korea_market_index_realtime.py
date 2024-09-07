import asyncio

import requests
from bs4 import BeautifulSoup

from app.data.common.constant import MARKET_INDEX_CACHE_SECOND
from app.module.asset.enum import Country, MarketIndex
from app.module.asset.redis_repository import RedisRealTimeMarketIndexRepository
from app.module.asset.schema import MarketIndexData
from database.dependency import get_redis_pool


async def fetch_market_data(redis_client):
    url = "https://finance.naver.com/"

    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")

    bulk_data = []

    section_stock_market = soup.find("div", {"class": "section_stock_market"})

    kospi_area = soup.find("div", {"class": "kospi_area"})
    current_value = kospi_area.find("span", {"class": "num"}).text.strip().replace(",", "")
    change_value = kospi_area.find("span", {"class": "num2"}).text.strip().replace(",", "")
    num3_span = kospi_area.find("span", {"class": "num3"})
    percent_change = (
        num3_span.text.replace(num3_span.find("span", {"class": "blind"}).text, "").strip().replace("%", "")
    )

    kospi_index = MarketIndexData(
        country=Country.KOREA,
        index_name=MarketIndex.KOSPI,
        current_value=current_value,
        change_value=change_value,
        change_percent=percent_change,
        update_time="",
    )

    kospi_index_json = kospi_index.model_dump_json()

    bulk_data.append((MarketIndex.KOSPI, kospi_index_json))

    kosdaq_area = section_stock_market.find("div", {"class": "kosdaq_area"})
    current_value = kosdaq_area.find("span", {"class": "num"}).text.strip().replace(",", "")
    change_value = kosdaq_area.find("span", {"class": "num2"}).text.strip().replace(",", "")
    num3_span = kosdaq_area.find("span", {"class": "num3"})
    percent_change = "".join(num3_span.stripped_strings).replace("%", "").strip()

    kosdaq_index = MarketIndexData(
        country=Country.KOREA,
        index_name=MarketIndex.KOSDAQ,
        current_value=current_value,
        change_value=change_value,
        change_percent=percent_change,
        update_time="",
    )

    kosdaq_index_json = kosdaq_index.model_dump_json()
    bulk_data.append((MarketIndex.KOSDAQ, kosdaq_index_json))

    await RedisRealTimeMarketIndexRepository.bulk_save(redis_client, bulk_data, expire_time=MARKET_INDEX_CACHE_SECOND)


async def main():
    redis_client = await get_redis_pool()
    while True:
        await fetch_market_data(redis_client)
        await asyncio.sleep(10)


if __name__ == "__main__":
    asyncio.run(main())
