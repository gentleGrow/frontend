from app.dependencies.database import get_redis_pool
from app.modules.asset_management.repository import RedisStockRepository
from app.modules.auth.repository import RedisJWTTokenRepository

redis_client = get_redis_pool()
redis_user_repository = RedisJWTTokenRepository(redis_client)
redis_stock_repository = RedisStockRepository(redis_client)
