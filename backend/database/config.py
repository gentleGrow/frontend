from os import getenv

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

POSTGRESSQL_URL = getenv("POSTGRESSQL_URL", None)
REDIS_URL = getenv("REDIS_URL", None)
REDIS_ENCODING = "utf-8"


engine = create_engine(POSTGRESSQL_URL)

PostgresSession = sessionmaker(autoflush=True, bind=engine)


PostgresBase = declarative_base()
