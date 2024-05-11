from os import getenv

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

ASYNC_MYSQL_URL = getenv("ASYNC_MYSQL_URL", None)

mysql_engine = create_async_engine(ASYNC_MYSQL_URL)
MySQLSession = sessionmaker(bind=mysql_engine, class_=AsyncSession, expire_on_commit=False)

MySQLBase = declarative_base()
