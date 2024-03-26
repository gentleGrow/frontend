from os import getenv

from dotenv import load_dotenv
from redis import Redis

from database.config import PostgresSession

load_dotenv()

REDIS_HOST = getenv("REDIS_HOST", None)
REDIS_PORT = getenv("REDIS_PORT", None)


def get_postgres_session():
    db = PostgresSession()
    try:
        yield db
    finally:
        db.close()


async def get_redis_pool() -> Redis:
    return Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
