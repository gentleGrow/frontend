# Library
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Module
from ..database.schemas import User
from ..database.config import get_db
from ..service.login_service import get_user, create_user

loginRouter = APIRouter()

# [정보] reponse_model은 반환되는 응답의 타입을 지정해 직렬화에 사용됩니다. 추가로 doc에 자동 정의시킵니다.
# [정보] tags는 docs에 사용되는 별칭입니다.
# [정보] Depends는 DI 함수로 해당 db 세션에 대해 초기화 작업입니다.
@loginRouter.get("/{social_id}", response_model=User, tags=["login"])
def read_users(social_id: str, db: Session = Depends(get_db)):
    users = get_user(db, social_id)
    if not users:
        return create_user(db, social_id)
    return users

