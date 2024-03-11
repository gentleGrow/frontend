# Library
from aredis import StrictRedis
# Module
from database.config import PostgresSession

#[정보] 새로운 세션을 연결시킵니다. yield를 통해서 세션 context를 핸들링합니다.
def get_postgres_session():
    db = PostgresSession()
    try:
        yield db
    finally:
        db.close()
        
async def get_redis_pool() -> StrictRedis:
    redis = StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    return redis

