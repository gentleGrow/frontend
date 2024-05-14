from os import getenv

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

MYSQL_URL = getenv("MYSQL_URL", None)

MYSQL_URL = "mysql+aiomysql://root:qwerasdf12@localhost:3306/assetmanagement"

mysql_engine = create_async_engine(MYSQL_URL)
MySQLSession = sessionmaker(bind=mysql_engine, class_=AsyncSession, expire_on_commit=False)

MySQLBase = declarative_base()
