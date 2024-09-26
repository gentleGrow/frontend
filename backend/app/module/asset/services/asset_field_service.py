from sqlalchemy.ext.asyncio import AsyncSession
from app.module.asset.constant import ASSET_FIELD
from app.module.asset.model import AssetField
from app.module.asset.repository.asset_field_repository import AssetFieldRepository


class AssetFieldService:
    @staticmethod
    async def get_asset_field(session: AsyncSession, user_id: int) -> list[str]:
        asset_field: AssetField = await AssetFieldRepository.get(session, user_id)

        if asset_field is None:
            await AssetFieldRepository.save(session, AssetField(user_id=user_id, field_preference=ASSET_FIELD))
            return ASSET_FIELD
        else:
            return asset_field.field_preference
