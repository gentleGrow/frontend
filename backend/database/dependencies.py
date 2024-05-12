from os import getenv

import redis.asyncio as aioredis
from dotenv import load_dotenv

from database.config import MySQLSession

load_dotenv()

REDIS_HOST = getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(getenv("REDIS_PORT", 6379))


async def get_mysql_session():
    db = MySQLSession()
    try:
        yield db
    finally:
        await db.close()


def get_redis_pool() -> aioredis.Redis:
    return aioredis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
