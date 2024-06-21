import asyncio
import logging
import os
from datetime import datetime

import yfinance

from app.module.asset.model import (  # noqa: F401 > relationship 설정시 필요합니다.
    Asset,
    AssetStock,
    ExchangeRate,
    Stock,
    StockDaily,
    StockMonthly,
    StockWeekly,
)
from app.module.asset.repository.exchange_rate_repository import ExchangeRateRepository
from app.module.auth.model import User  # noqa: F401 > relationship 설정시 필요합니다.
from data.yahoo.source.constant import currency_pairs
from database.dependency import get_mysql_session

log_dir = "./logs"
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    filename="./logs/exchange_rate.log",
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


async def fetch_exchange_rate(source_currency: str, target_currency: str) -> float | None:
    pair = f"{source_currency}{target_currency}=X"
    try:
        ticker = yfinance.Ticker(pair)
    except Exception:
        return None
    else:
        hist = ticker.history(period="1d")
        if not hist.empty:
            rate = hist["Close"][0]
            return rate
    return None


async def main():
    async for session in get_mysql_session():
        logging.info("exchange_rate를 시작합니다.")
        for source_currency, target_currency in currency_pairs:
            logging.info(f"{source_currency=}")
            logging.info(f"{target_currency=}")

            rate = await fetch_exchange_rate(source_currency, target_currency)

            if rate is None:
                continue

            current_time = datetime.now().date()
            exchange_rate = ExchangeRate(
                source_currency=source_currency, target_currency=target_currency, rate=rate, date=current_time
            )

            await ExchangeRateRepository.save(session, exchange_rate)

        logging.info("exchange_rate를 마칩니다.")


if __name__ == "__main__":
    asyncio.run(main())
