from fastapi import APIRouter

# [정보] 동일 path 별로 router를 관리합니다.
userRouter = APIRouter()

# [정보] tags는 docs에 사용되는 별칭입니다.
@userRouter.get("/users/", tags=["users"])
async def read_users():
    return [{"username":"Rick"},{"username":"Morty"}]
