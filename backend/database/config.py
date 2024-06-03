from os import getenv

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from database.enums import EnvironmentType

load_dotenv()

ENVIRONMENT = getenv("ENVIRONMENT", None)

if ENVIRONMENT == EnvironmentType.DEV:
    MYSQL_URL = getenv("LOCAL_MYSQL_URL", None)
else:
    MYSQL_URL = getenv("MYSQL_URL", None)

mysql_engine = create_async_engine(MYSQL_URL)
MySQLSession = sessionmaker(bind=mysql_engine, class_=AsyncSession, expire_on_commit=False)

MySQLBase = declarative_base()
