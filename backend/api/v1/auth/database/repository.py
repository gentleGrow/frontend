# Library
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
# Module
from api.v1.auth.database.models import User
from api.v1.auth.database.schemas import ProviderEnum, UserRoleEnum

class DBHandler():
    def get_user(self, db: Session, social_id: str, provider: ProviderEnum):
        return db.query(User).filter(User.social_id == social_id, User.provider == provider.value).first()

    def create_user(self, db: Session, social_id: str, provider: ProviderEnum, role: UserRoleEnum=None, nickname: str=None):
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
