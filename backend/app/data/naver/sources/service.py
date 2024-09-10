import asyncio

from aiohttp import ClientSession, ClientTimeout
from bs4 import BeautifulSoup
from os import getenv

from dotenv import load_dotenv

from app.module.asset.schema import StockInfo
from app.module.asset.enum import CountryMarketCode
from icecream import ic
from app.data.naver.sources.constant import USA, NYSE
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager  
from bs4 import BeautifulSoup
from database.enum import EnvironmentType

load_dotenv()
ENVIRONMENT = getenv("ENVIRONMENT", None)

class WorldStockService:
    @staticmethod
    async def get_world_stock_prices(code_list: list[StockInfo]) -> list[tuple[str, int | Exception]]:
        tasks = [WorldStockService._fetch_world_stock_price(stockinfo) for stockinfo in code_list]
        prices = await asyncio.gather(*tasks, return_exceptions=True)
        return [(stockinfo.code, result) for stockinfo, result in zip(code_list, prices)]
    
    @staticmethod
    async def _fetch_world_stock_price(stockinfo: StockInfo) -> int:
        uppercase_country = stockinfo.country.upper()
        uppercase_market_index = stockinfo.market_index.upper()
        symbol = CountryMarketCode[uppercase_country].value

        if uppercase_country == USA and uppercase_market_index == NYSE:
            url = f"https://m.stock.naver.com/worldstock/stock/{stockinfo.code}/total"
        else:
            url = f"https://m.stock.naver.com/worldstock/stock/{stockinfo.code}.{symbol}/total"
        
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--headless') 
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        if ENVIRONMENT == EnvironmentType.DEV:
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        else:
            driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=chrome_options)

        
        try:
            driver.get(url)
            
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "GraphMain_stockInfo__IEsqt"))
            )
            
            html = driver.page_source
            soup = BeautifulSoup(html, "html.parser")
            
            content_div = soup.find(id="content")
            if not content_div:
                return 0

            ad_world = content_div.find(id="ad_world_end")
            
            next_sibling_div = ad_world.find_next_sibling("div")
            if not next_sibling_div:
                return 0 

            first_child_of_first_child = next_sibling_div.find("div").find("div")
            if not first_child_of_first_child:
                return 0 
            
            strong_element = first_child_of_first_child.find("strong")
            strong_text = strong_element.find(text=True, recursive=False).strip() if strong_element else ""

            em_element = first_child_of_first_child.find("em")
            em_text = em_element.get_text(strip=True) if em_element else ""

            combined_text = f"{strong_text}{em_text}"
            
            try:
                return float(combined_text)
            except ValueError:
                ic(f"code : {stockinfo.code}, {combined_text}을 정수로 전환이 안됩니다.")
                return 0
        
        except Exception:
            return 0

        finally:
            driver.quit()        



async def fetch_stock_price(session: ClientSession, code: str) -> int:
    url = f"https://finance.naver.com/item/main.nhn?code={code}"

    try:
        async with session.get(url, timeout=ClientTimeout(total=2)) as response:
            response.raise_for_status()
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")
            today = soup.select_one("#chart_area > div.rate_info > div")
            if today is None:
                return 0

            price_text = today.select_one(".blind").get_text()
            return int(price_text.replace(",", ""))
    except Exception as e:
        ic(f"Error fetching stock price for {code}: {e}")
        return 0

async def get_stock_prices(code_list: list[StockInfo]) -> list[tuple[str, int | Exception]]:
    async with ClientSession() as session:
        tasks = [fetch_stock_price(session, stockInfo.code) for stockInfo in code_list]

        prices = await asyncio.gather(*tasks, return_exceptions=True)
        return [(stockInfo.code, result) for stockInfo, result in zip(code_list, prices)]

