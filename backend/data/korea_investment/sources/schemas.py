from pydantic import BaseModel, Field

from data.common.enums import SuccessCode, TradeType


class Header(BaseModel):
    tr_id: TradeType
    tr_key: str = Field(
        ...,
        description="거래 ID, '종목코드' 입력(tr_id가 H0STCNT0 or H0STASP0일 경우), 'HTS ID' 입력(tr_id가 H0STCNI0 or H0STCNI9일 경우",
    )
    encrypt: str = Field(..., description="암호화 여부", examples="N")


class Output(BaseModel):
    iv: str = Field(..., description="Initial Vector, 암호화를 위해 사용되는 값입니다.")
    key: str


class Body(BaseModel):
    rt_cd: SuccessCode = Field(..., description="웹 소켓 데이터 응답 값입니다")
    msg_cd: str = Field(..., description="주식 종목 코드입니다.", examples="OPSP0000")
    msg1: str = Field(..., description="웹 소켓 연결 결과입니다.", examples="SUBSCRIBE SUCCESS")
    output: Output


class StockData(BaseModel):
    header: Header
    body: Body


class StockTransaction(BaseModel):
    stock_code: str | None
    current_price: str | None
