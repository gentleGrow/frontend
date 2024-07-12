from datetime import datetime

from sqlalchemy.dialects.mysql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import StockRealtime


class StockRealtimeRepository:
    @staticmethod
    async def save(session: AsyncSession, stocks: list[StockRealtime]) -> None:
        session.add_all(stocks)
        await session.commit()

    @staticmethod
    async def upsert(session: AsyncSession, stocks: list[StockRealtime]) -> None:
        current_time = datetime.now()
        stmt = insert(StockRealtime).values(
            [
                {
                    "code": stock.code,
                    "name": stock.name,
                    "price": stock.price,
                    "country": stock.country,
                    "market_index": stock.market_index,
                    "created_at": stock.created_at if stock.created_at else current_time,
                    "updated_at": stock.updated_at if stock.updated_at else current_time,
                }
                for stock in stocks
            ]
        )
        on_duplicate_key_stmt = stmt.on_duplicate_key_update(
            name=stmt.inserted.name,
            price=stmt.inserted.price,
            country=stmt.inserted.country,
            market_index=stmt.inserted.market_index,
            updated_at=stmt.inserted.updated_at,
        )
        await session.execute(on_duplicate_key_stmt)
        await session.commit()
