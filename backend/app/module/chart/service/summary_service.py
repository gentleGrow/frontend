from app.module.asset.model import Asset
from datetime import datetime, timedelta
from app.module.asset.services.asset_stock_service import AssetStockService


class SummaryService:
    @staticmethod
    def get_today_review_rate(
        assets:list[Asset],
        total_asset_amount:float,
        current_stock_price_map:dict[str, float],
        exchange_rate_map:dict[str, float]
    ) -> float:
        assets_30days = [asset for asset in assets if asset.asset_stock.purchase_date <= datetime.now().date() - timedelta(days=30)]
        
        if len(assets_30days) == 0:
            return 100.0
        else:
            total_asset_amount_30days:float = AssetStockService.get_total_asset_amount(
                assets_30days, current_stock_price_map, exchange_rate_map
            )
            return (total_asset_amount - total_asset_amount_30days) / total_asset_amount * 100 if total_asset_amount_30days > 0 else 0.0
        
        