#[정보] Library
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
#[정보] module
from . import crud, models, schemas
from .database import SessionLocal, engine

#[정보] Base는 해당 객체를 상속받은 클래스의 모든 정보를 담습니다. 현 engine을 연결시켜 스키마를 확인합니다.
models.Base.metadata.create_all(bind=engine)
app = FastAPI()

#[정보] 새로운 세션을 연결시킵니다. yield를 통해서 세션 context를 핸들링합니다.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# [정보] reponse_model은 반환되는 응답의 타입을 지정해 직렬화에 사용됩니다. 추가로 doc에 자동 정의시킵니다.
@app.post("/users/", response_model=schemas.User)
# [정보] Depends는 DI 함수로 해당 db 세션에 대하 초기화 작업입니다.
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/items/", response_model=schemas.Item)
def create_item_for_user(
    user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
):
    return crud.create_user_item(db=db, item=item, user_id=user_id)


@app.get("/items/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items