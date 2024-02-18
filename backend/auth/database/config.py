# Library
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from os import getenv

# [정보] .env 변수값을 environment에 설정합니다.
load_dotenv()
# [정보] 엔진명://user/pw@서버주소/db명
DATABASE_URL = getenv('DATABASE_URL', None)

# [정보] db 연결을 위해 엔진 객체 생성을 합니다. 
engine = create_engine(DATABASE_URL)

# [정보] db와의 세션을 생성합니다. 이때 자동 커밋, autoflush(db 변화 행위 자동 수행)을 하지않으며 세션과 엔진에 연결합니다.
SessionLocal = sessionmaker(autoflush=True, bind=engine)

# [정보] 모든 ORM 클래스에 전달될 기본 클래스입니다.
Base = declarative_base()

#[정보] 새로운 세션을 연결시킵니다. yield를 통해서 세션 context를 핸들링합니다.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()