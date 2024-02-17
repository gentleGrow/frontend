from sqlalchemy import create_engine
from database.config import Base, SQLALCHEMY_DATABASE_URL

def create_tables():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("[정보] 성공적으로 테이블을 생성하였습니다.")
