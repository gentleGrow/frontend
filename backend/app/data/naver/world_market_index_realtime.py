import asyncio

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from app.data.common.constant import MARKET_INDEX_CACHE_SECOND
from app.data.naver.sources.constant import INDEX_NAME_TRANSLATIONS
from app.data.naver.sources.schema import MarketIndexData
from app.module.asset.redis_repository import RedisRealTimeMarketIndexRepository
from database.dependency import get_redis_pool


async def main():
    redis_client = await get_redis_pool()
    driver = webdriver.Chrome()

    driver.get("https://finance.naver.com/world/")
    bulk_data = []

    try:
        america_index_table = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "americaIndex")))

        tr_rows = america_index_table.find_elements(By.XPATH, ".//thead/tr")

        for tr_row in tr_rows:
            tr_row_data = []
            tds = tr_row.find_elements(By.TAG_NAME, "td")

            for td in tds:
                if "graph" in td.get_attribute("class"):
                    continue

                span = td.find_elements(By.TAG_NAME, "span")
                if span:
                    tr_row_data.append(span[0].text)
                else:
                    a_elements = td.find_elements(By.TAG_NAME, "a")
                    if a_elements:
                        tr_row_data.append(a_elements[0].text)
                    else:
                        tr_row_data.append(td.text)

            if tr_row_data:
                index_name_kr = tr_row_data[1]
                index_name_en = INDEX_NAME_TRANSLATIONS.get(index_name_kr, index_name_kr)

                market_index = MarketIndexData(
                    country=tr_row_data[0],
                    index_name=index_name_en,
                    current_value=tr_row_data[2],
                    change_value=tr_row_data[3],
                    change_percent=tr_row_data[4],
                    update_time=tr_row_data[5],
                )

                if market_index:
                    market_index_json = market_index.model_dump_json()
                    bulk_data.append((index_name_en, market_index_json))

        await RedisRealTimeMarketIndexRepository.bulk_save(
            redis_client, bulk_data, expire_time=MARKET_INDEX_CACHE_SECOND
        )

    finally:
        driver.quit()


if __name__ == "__main__":
    asyncio.run(main())
