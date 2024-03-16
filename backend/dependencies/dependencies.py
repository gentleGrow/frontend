from aredis import StrictRedis

from database.config import PostgresSession


def get_postgres_session():
    db = PostgresSession()
    try:
        yield db
    finally:
        db.close()


async def get_redis_pool() -> StrictRedis:
    redis = StrictRedis(host="localhost", port=6379, db=0, decode_responses=True)
    return redis
