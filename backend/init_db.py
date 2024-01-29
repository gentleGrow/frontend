from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .app.database import Base, SQLALCHEMY_DATABASE_URL
from .app.models import User, Item  

def create_tables():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Tables created successfully.")
