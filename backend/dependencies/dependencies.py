# Module
from database.config import PostgresSession

#[정보] 새로운 세션을 연결시킵니다. yield를 통해서 세션 context를 핸들링합니다.
def get_RDB():
    db = PostgresSession()
    try:
        yield db
    finally:
        db.close()
        
