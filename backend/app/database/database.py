from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# [정보] 엔진명://user/pw@서버주소/db명
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost/assetManagement"

# [정보] create_engine > db 연결을 위한 객체 생성을 합니다. 
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# [정보] db와의 세션을 생성합니다. 이때 자동 커밋, autoflush(db 변화 행위 자동 수행)을 하지않으며 세션과 엔진에 연결합니다.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# [정보] 모든 ORM 클래스에 전달될 기본 클래스입니다.
Base = declarative_base()

#[정보] 새로운 세션을 연결시킵니다. yield를 통해서 세션 context를 핸들링합니다.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()