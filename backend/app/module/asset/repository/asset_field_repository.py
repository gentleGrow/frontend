from app.module.asset.model import AssetField
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

class AssetFieldRepository:
    @staticmethod
    async def get(session: AsyncSession, user_id:int) -> AssetField | None:
        select_instance = select(AssetField).where(AssetField.user_id == user_id)
        result = await session.execute(select_instance)
        return result.scalars().first()
    
    
    @staticmethod
    async def save(session: AsyncSession, asset_field: AssetField) -> None:
        session.add(asset_field)
        await session.commit()