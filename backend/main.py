#[정보] Library
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
#[정보] module
import models
from router import users_router, items_router
from database import engine


#[정보] Base는 해당 객체를 상속받은 클래스의 모든 정보를 담습니다. 현 engine을 연결시켜 스키마를 확인합니다.
models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(users_router.usersRouter, prefix="/users", tags=["users"])
app.include_router(items_router.itemsRouter, prefix="/items", tags=["items"])