from os import getenv

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

MYSQL_URL = getenv("MYSQL_URL", None)
ASYNC_MYSQL_URL = getenv("ASYNC_MYSQL_URL", None)

engine = create_engine(MYSQL_URL)

MySQLSession = sessionmaker(autoflush=True, bind=engine)

MySQLBase = declarative_base()

async_engine = create_async_engine(ASYNC_MYSQL_URL)

AsyncDBSession = sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)
