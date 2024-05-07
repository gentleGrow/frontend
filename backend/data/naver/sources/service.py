import asyncio

import aiohttp
from bs4 import BeautifulSoup


async def fetch_stock_price(session, code):
    url = f"https://finance.naver.com/item/main.nhn?code={code}"  # noqa: E231 > 올바른 url 확인

    async with session.get(url) as response:
        response.raise_for_status()
        html = await response.text()
        soup = BeautifulSoup(html, "html.parser")
        today = soup.select_one("#chart_area > div.rate_info > div")
        price = today.select_one(".blind").get_text()
        return price


async def get_stock_prices(code_list):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_stock_price(session, str(stock_code)) for stock_code, stock_name, stock_index in code_list]
        prices = await asyncio.gather(*tasks)
        return prices


async def get_current_stock_price(stock_code_chunk):
    prices = await get_stock_prices(stock_code_chunk)
    return prices
