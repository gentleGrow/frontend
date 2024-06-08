import asyncio

from aiohttp import ClientSession
from bs4 import BeautifulSoup

from app.common.util.logging import logging
from app.module.asset.schema.stock_schema import StockList, StockPrice, StockPriceList


async def fetch_stock_price(session: ClientSession, code: str) -> StockPrice:
    url = f"https://finance.naver.com/item/main.nhn?code={code}"

    try:
        async with session.get(url) as response:
            response.raise_for_status()
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")
            today = soup.select_one("#chart_area > div.rate_info > div")
            if today is None:
                logging.warning(f"[fetch_stock_price] Could not find price information for stock code: {code}")
                return StockPrice(price=0)

            price_text = today.select_one(".blind").get_text()
            price_number = int(price_text.replace(",", ""))
            return StockPrice(price=price_number)
    except Exception as e:
        logging.error(f"[fetch_stock_price] Error fetching stock price for code {code}: {e}")
        return StockPrice(price=0)


async def get_stock_prices(code_list: StockList) -> StockPriceList:
    async with ClientSession() as session:
        tasks = [fetch_stock_price(session, stock.code) for stock in code_list.stocks]
        prices = await asyncio.gather(*tasks)
        return StockPriceList(prices=prices)
