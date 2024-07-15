from redis.asyncio import Redis

from app.common.repository.base_repository import AbstractCRUDRepository


class RedisStockRepository(AbstractCRUDRepository):
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def get(self, key: str) -> int | dict | str | list | tuple | None:
        return await self.redis.get(key)

    async def save(self, key: str, data: int | dict | str | list | tuple, expire_time: int) -> None:
        await self.redis.set(key, data, ex=expire_time)
