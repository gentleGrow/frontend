# Library
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
# Module
from ..database.models import User
from ..database.models import User, ProviderEnum, RoleEnum

def get_user(db: Session, social_id: str):
    return db.query(User).filter(User.social_id == social_id).first()

def create_user(db: Session, social_id: str, provider: ProviderEnum=None, role: RoleEnum=None, nickname: str=None):
    new_user = User(
            id=uuid4(),  
            social_id=social_id,
            provider=provider,
            role=role,
            nickname=nickname,
            created_at=datetime.now()  
        )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  
    return new_user

