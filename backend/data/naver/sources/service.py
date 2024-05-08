import asyncio

from aiohttp import ClientSession
from bs4 import BeautifulSoup

from data.common.schemas import StockList, StockPrice, StockPriceList


async def fetch_stock_price(session: ClientSession, code: str) -> int:
    url = f"https://finance.naver.com/item/main.nhn?code={code}"  # noqa: E231 > 올바른 url 확인

    async with session.get(url) as response:
        response.raise_for_status()
        html = await response.text()
        soup = BeautifulSoup(html, "html.parser")
        today = soup.select_one("#chart_area > div.rate_info > div")
        price_text = today.select_one(".blind").get_text()
        price_number = int(price_text.replace(",", ""))
        return StockPrice(price=price_number)


async def get_stock_prices(code_list: StockList) -> StockPriceList:
    async with ClientSession() as session:
        tasks = [fetch_stock_price(session, stock.code) for stock in code_list.stocks]
        prices = await asyncio.gather(*tasks)
        return StockPriceList(prices=prices)
