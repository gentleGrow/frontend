from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

# [정보] main에 app instance을 호출하여 실행합니다.
# uvicorn main:app --reload