import asyncio
import requests
from bs4 import BeautifulSoup
from app.module.asset.redis_repository import RedisRealTimeMarketIndexRepository
from database.dependency import get_redis_pool

async def main():
    redis_client = await get_redis_pool()
    url = "https://finance.naver.com/"

    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")

    section_stock_market = soup.find('div', {'class': 'section_stock_market'})

    kospi_area = soup.find('div', {'class': 'kospi_area'})

    current_value = kospi_area.find('span', {'class': 'num'}).text.strip()
    change_value = kospi_area.find('span', {'class': 'num2'}).text.strip()
    num3_span = kospi_area.find('span', {'class': 'num3'})
    percent_change = num3_span.text.replace(num3_span.find('span', {'class': 'blind'}).text, '').strip()
    direction = num3_span.find('span', {'class': 'blind'}).text.strip()

    print(f"Current Value: {current_value}")
    print(f"Change Value: {change_value}")
    print(f"Percent Change: {percent_change}")
    print(f"Direction: {direction}")

    kosdaq_area = section_stock_market.find('div', {'class': 'kosdaq_area'})
    current_value = kosdaq_area.find('span', {'class': 'num'}).text.strip()
    change_value = kosdaq_area.find('span', {'class': 'num2'}).text.strip()

    num3_span = kosdaq_area.find('span', {'class': 'num3'})
    percent_change = num3_span.find_all('span')[-1].text.strip() 
    direction = num3_span.find('span', {'class': 'blind'}).text.strip()

    print(f"KOSDAQ Current Value: {current_value}")
    print(f"KOSDAQ Change Value: {change_value}")
    print(f"KOSDAQ Percent Change: {percent_change}")
    print(f"KOSDAQ Direction: {direction}")
    

if __name__ == "__main__":
    asyncio.run(main())
