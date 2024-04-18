from pydantic import BaseModel

from data.sources.enums import SuccessCode, TradeType


class Header(BaseModel):
    tr_id: TradeType
    tr_key: str
    encrypt: str


class Output(BaseModel):
    iv: str
    key: str


class Body(BaseModel):
    rt_cd: SuccessCode
    msg_cd: str
    msg1: str
    output: Output


class StockData(BaseModel):
    header: Header
    body: Body


class StockTransaction(BaseModel):
    stock_code: str | None
    transaction_time: str | None
    current_price: str | None
    change_sign: str | None
    change: str | None
    change_percentage: str | None
    weighted_avg_price: str | None
    opening_price: str | None
    high_price: str | None
    low_price: str | None
    sell_price: str | None
    buy_price: str | None
    transaction_volume: str | None
    cumulative_volume: str | None
    cumulative_transaction_amount: str | None
    sell_transaction_count: str | None
    buy_transaction_count: str | None
    net_buy_transaction_count: str | None
    transaction_strength: str | None
    total_sell_quantity: str | None
    total_buy_quantity: str | None
    transaction_type: str | None
    buy_ratio: str | None
    fluctuation_rate: str | None
    opening_time: str | None
    opening_price_indicator: str | None
    price_change_since_open: str | None
    high_price_time: str | None
    high_price_indicator: str | None
    price_change_since_high: str | None
    low_price_time: str | None
    low_price_indicator: str | None
    price_change_since_low: str | None
    business_day: str | None
    operational_code: str | None
    suspension_status: str | None
    sell_order_book_quantity: str | None
    buy_order_book_quantity: str | None
    total_sell_order_book_quantity: str | None
    total_buy_order_book_quantity: str | None
    trading_turnover_rate: str | None
    cumulative_volume_same_time_previous_day: str | None
    cumulative_volume_ratio_previous_day: str | None
    time_indicator: str | None
    arbitrary_end_indicator: str | None
    static_vi_activation_price: str | None
