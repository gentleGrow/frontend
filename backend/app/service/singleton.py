from app.dependencies.database import get_redis_pool
from app.modules.auth.repository import RedisTokenRepository

redis_client = get_redis_pool()
redis_repository = RedisTokenRepository(redis_client)
