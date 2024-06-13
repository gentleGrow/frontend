from redis.asyncio import Redis

from app.common.repository.base_repository import AbstractCRUDRepository
from app.module.asset.constant import DUMMY_ASSET_EXPIRE_SECOND, DUMMY_ASSET_KEY
from app.module.asset.schema.stock_schema import StockAssetResponse, StockList, StockPriceList


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
        return await self.redis.get(stock_code)

    async def get_dummy_asset(self) -> StockAssetResponse | None:
        data = await self.redis.get(DUMMY_ASSET_KEY)
        if data:
            return StockAssetResponse.model_validate_json(data)
        return None

    async def save_dummy_asset(self, response: StockAssetResponse, expiry: int = DUMMY_ASSET_EXPIRE_SECOND) -> None:
        await self.redis.set(DUMMY_ASSET_KEY, response.model_dump_json(), ex=expiry)
