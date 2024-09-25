import json

from redis.asyncio import Redis

from app.data.investing.sources.enum import RicePeople
from app.module.chart.redis_repository import RedisRichPortfolioRepository


class RichPortfolioService:
    @staticmethod
    async def get_rich_porfolio_map(
        redis_client: Redis,
    ) -> dict[str, dict]:
        rich_people = [person.value for person in RicePeople]
        rich_portfolios: list[str | None] = await RedisRichPortfolioRepository.gets(redis_client, rich_people)

        return {
            person: json.loads(portfolio)
            for person, portfolio in zip(rich_people, rich_portfolios)
            if person and portfolio 
        }
