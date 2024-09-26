from redis.asyncio import Redis

from app.data.investing.sources.enum import RicePeople
from app.module.chart.service.rich_portfolio_service import RichPortfolioService


class TestRichPortfolioService:
    async def test_get_rich_porfolio_map_success(self, redis_client: Redis, setup_rich_portfolio):
        # Given
        expected_rich_people = [person.value for person in RicePeople]
        expected_portfolio = setup_rich_portfolio

        # When
        rich_portfolio = await RichPortfolioService.get_rich_porfolio_map(redis_client)

        # Then
        assert len(rich_portfolio) == len(expected_rich_people)
        for person, portfolio in rich_portfolio.items():
            assert person in expected_rich_people
            assert portfolio in expected_portfolio

    async def test_get_rich_porfolio_map_fail(self, redis_client: Redis):
        # Given
        expected_rich_people = ["warren-buffett"]
        expected_portfolio = [{"AAPL": "30.1%", "BAC": "14.7%"}]

        # When
        rich_portfolio = await RichPortfolioService.get_rich_porfolio_map(redis_client)

        # Then
        assert len(rich_portfolio) != len(expected_rich_people)
        for person, portfolio in rich_portfolio.items():
            assert person not in expected_rich_people
            assert portfolio not in expected_portfolio
