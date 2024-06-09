from app.module.asset.repository.redis_repository import RedisStockRepository
from app.module.auth.repository import RedisJWTTokenRepository
from database.dependency import get_redis_pool

redis_client = get_redis_pool()
redis_user_repository = RedisJWTTokenRepository(redis_client)
redis_stock_repository = RedisStockRepository(redis_client)
