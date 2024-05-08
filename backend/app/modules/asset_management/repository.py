from redis import Redis

from app.common.repository.base_repository import AbstractCRUDRepository
from data.common.schemas import StockList, StockPriceList


class RedisStockRepository(AbstractCRUDRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def save(self, stock_code_chunk: StockList, price_list: StockPriceList, expiry: int) -> None:
        async with self.redis.pipeline() as pipe:
            for code, price in [
                (stock.code, price.price) for stock, price in zip(stock_code_chunk.stocks, price_list.prices)
            ]:
                pipe.set(code, price, ex=expiry)
            await pipe.execute()

    async def get(self, stock_code: str) -> int:
        price = await self.redis.get(stock_code)
        return price
