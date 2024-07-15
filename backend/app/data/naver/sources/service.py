import asyncio

from aiohttp import ClientSession
from bs4 import BeautifulSoup

from app.module.asset.schema.stock_schema import StockInfo, StockPrice


async def fetch_stock_price(session: ClientSession, code: str) -> StockPrice:
    url = f"https://finance.naver.com/item/main.nhn?code={code}"

    try:
        async with session.get(url) as response:
            response.raise_for_status()
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")
            today = soup.select_one("#chart_area > div.rate_info > div")
            if today is None:
                return StockPrice(price=0)

            price_text = today.select_one(".blind").get_text()
            price_number = int(price_text.replace(",", ""))
            return StockPrice(price=price_number)
    except Exception:
        return StockPrice(price=0)


async def get_stock_prices(code_list: list[StockInfo]) -> list[StockPrice]:
    async with ClientSession() as session:
        tasks = [fetch_stock_price(session, stockInfo.code) for stockInfo in code_list]
        prices = await asyncio.gather(*tasks)
        return prices
