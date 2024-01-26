from fastapi import FastAPI
from routers import userRouter

app = FastAPI()

app.include_router(userRouter)