from pydantic import BaseModel

class ItemBase(BaseModel):
    title: str
    description: str | None = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    owner_id: int
    #[정보] Config을 통해서 DB 데이터의 직렬화/비직렬화를 설정합니다. 이를 통해 직접 db에서 endpoint까지 데이터 변환 과정없이 전달이 가능합니다.
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    #[정보] 기본값 설정으로 빈 배열을 설정하였습니다.
    items: list[Item] = []

    class Config:
        orm_mode = True
        
