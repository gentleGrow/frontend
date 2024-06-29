from typing import List

from fastapi import status
from fastapi.exceptions import HTTPException


class NotFoundStockCodesException(HTTPException):
    def __init__(self, not_found_stock_codes: List[str]):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST, detail={"not_found_stock_codes": not_found_stock_codes}
        )
