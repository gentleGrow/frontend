import asyncio
from os import getenv

from dotenv import load_dotenv
from icecream import ic
from redis.asyncio import Redis
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from sqlalchemy.ext.asyncio import AsyncSession
from webdriver_manager.chrome import ChromeDriverManager

from database.dependency import get_mysql_session, get_redis_pool
from database.enum import EnvironmentType

load_dotenv()
ENVIRONMENT = getenv("ENVIRONMENT", None)


async def fetch_rich_porfolio(redis_client: Redis, session: AsyncSession):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    if ENVIRONMENT == EnvironmentType.DEV:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    else:
        driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=chrome_options)

    url = "https://kr.investing.com/pro/ideas/warren-buffett"
    driver.get(url)

    WebDriverWait(driver, 30).until(
        EC.presence_of_element_located((By.XPATH, "//div[@id='root']//table//tr//th[contains(text(),'Ticker')]"))
    )

    tbody = driver.find_element(By.XPATH, "//div[@id='root']//table//tbody")

    rows = tbody.find_elements(By.TAG_NAME, "tr")

    for row in rows:
        columns = row.find_elements(By.TAG_NAME, "td")

        for column in columns:
            try:
                a_tag = column.find_element(By.TAG_NAME, "a")
                if a_tag:
                    ic(a_tag.get_attribute("textContent"))
            except Exception as e:
                print(f"Error: {e}")

    driver.quit()


async def main():
    redis_client = await get_redis_pool()
    async with get_mysql_session() as session:
        await fetch_rich_porfolio(redis_client, session)


if __name__ == "__main__":
    asyncio.run(main())
