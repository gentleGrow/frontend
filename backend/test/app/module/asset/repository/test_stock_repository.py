from sqlalchemy.ext.asyncio import AsyncSession
from icecream import ic
from app.module.asset.repository.stock_repository import StockRepository


async def test_get_all_stocks(db_session: AsyncSession, setup_initial_data):
    # Given
    setup_initial_data

    # When
    stocks = await StockRepository.get_all(db_session)
    
    # Then
    assert stocks[0].code == "AAPL"
    assert stocks[0].name == "Apple Inc."
    assert stocks[1].code == "TSLA"
    assert stocks[1].name == "Tesla Inc."
