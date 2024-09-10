from sqlalchemy.dialects.mysql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.module.asset.model import StockMinutely


class StockMinutelyRepository:
    @staticmethod
    async def bulk_upsert(session: AsyncSession, stocks: list[StockMinutely]) -> None:
        stmt = insert(StockMinutely).values(
            [
                {
                    "code": stock.code,
                    "datetime": stock.datetime,
                    "current_price": stock.current_price,
                }
                for stock in stocks
            ]
        )

        update_dict = {"current_price": stmt.inserted.current_price}

        upsert_stmt = stmt.on_duplicate_key_update(update_dict)

        try:
            await session.execute(upsert_stmt)
            await session.commit()
        except Exception:
            await session.rollback()
