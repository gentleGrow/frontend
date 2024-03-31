from os import getenv

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

MYSQL_URL = getenv("MYSQL_URL", None)

engine = create_engine(MYSQL_URL)

MySQLSession = sessionmaker(autoflush=True, bind=engine)

MySQLBase = declarative_base()
