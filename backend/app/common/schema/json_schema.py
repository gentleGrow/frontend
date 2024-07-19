from pydantic import BaseModel


class JsonResponse(BaseModel):
    status_code: int
    content: dict
