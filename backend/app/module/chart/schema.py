from collections import defaultdict
from datetime import date, datetime
from statistics import mean

from pydantic import BaseModel, Field, RootModel
from app.module.chart.enum import IntervalType
from app.module.asset.constant import MARKET_INDEX_KR_MAPPING
from app.module.asset.enum import MarketIndex


class ChartTipResponse(RootModel[str]):
    pass


class ProfitDetail(BaseModel):
    profit_amount: float = Field(..., description="수익금")
    profit_rate: float = Field(..., description="수익률")


class SummaryResponse(BaseModel):
    today_review_rate: float = Field(..., description="오늘의 review")
    total_asset_amount: float = Field(..., description="나의 총 자산")
    total_investment_amount: float = Field(..., description="나의 투자 금액")
    profit: ProfitDetail = Field(..., description="수익 정보")


class MarketIndiceResponseValue(BaseModel):
    name: str = Field(..., example=f"{', '.join([e.value for e in MarketIndex])}")
    name_kr: str = Field(..., description="한국어 지수 이름", example=f"{', '.join(MARKET_INDEX_KR_MAPPING.values())}")
    current_value: float = Field(..., description="현재 지수")
    change_percent: float = Field(..., description="1일 기준 변동성")


class MarketIndiceResponse(BaseModel):
    market_indices: list[MarketIndiceResponseValue]


class CompositionResponseValue(BaseModel):
    name: str = Field(..., description="종목 명 혹은 계좌 명")
    percent_rate: float = Field(..., description="비중")
    current_amount: float = Field(..., description="현재가")


class CompositionResponse(RootModel[list[CompositionResponseValue]]):
    pass


class PerformanceAnalysisResponse(BaseModel):
    xAxises: list[str]
    dates: list[str]
    values1: dict
    values2: dict
    unit: str

    @staticmethod
    def get_performance_analysis_response(
        market_analysis_result: dict[date, float], user_analysis_result: dict[date, float], interval: IntervalType
    ) -> "PerformanceAnalysisResponse":
        market_analysis_monthly = defaultdict(list)
        user_analysis_monthly = defaultdict(list)

        for d, value in market_analysis_result.items():
            year_month = d.strftime("%Y.%m")
            market_analysis_monthly[year_month].append(value)

        for d, value in user_analysis_result.items():
            year_month = d.strftime("%Y.%m")
            user_analysis_monthly[year_month].append(value)

        sorted_dates = sorted(market_analysis_monthly.keys())

        averaged_market_analysis = [mean(market_analysis_monthly[year_month]) for year_month in sorted_dates]
        averaged_user_analysis = [mean(user_analysis_monthly[year_month]) for year_month in sorted_dates]

        formatted_year_months = [datetime.strptime(d, "%Y.%m").strftime("%Y.%m") for d in sorted_dates] 
        formatted_xAxises = [datetime.strptime(d, "%Y.%m").strftime("%y.%m") for d in sorted_dates] 

        if interval == IntervalType.ONEYEAR:
            formatted_xAxises = []
            previous_year = None
            for d in sorted_dates:
                current_date = datetime.strptime(d, "%Y.%m")
                current_year = current_date.strftime("%y")
                current_month = current_date.strftime("%m")

                if current_year != previous_year:
                    formatted_xAxises.append(f"{current_year}.{current_month}")
                    previous_year = current_year
                else:
                    formatted_xAxises.append(current_month)

        return PerformanceAnalysisResponse(
            xAxises=formatted_xAxises,
            dates=formatted_year_months,
            values1={"values": averaged_user_analysis, "name": "내 수익률"},
            values2={"values": averaged_market_analysis, "name": "코스피"},
            unit="%",
        )





class EstimateDividendEveryValue(BaseModel):
    xAxises: list[str] = Field(..., description="월별 표시 (1월, 2월, ...)")
    data: list[float] = Field(..., description="월별 배당금 데이터")
    unit: str = Field(..., description="단위")
    total: float = Field(..., description="해당 연도의 배당금 총합")


class EstimateDividendEveryResponse(RootModel[dict[str, EstimateDividendEveryValue]]):
    pass


class EstimateDividendTypeValue(BaseModel):
    name: str
    current_amount: float
    percent_rate: float


class EstimateDividendTypeResponse(RootModel[list[EstimateDividendTypeValue]]):
    pass


class MyStockResponseValue(BaseModel):
    name: str
    current_price: float
    profit_rate: float
    profit_amount: float
    quantity: int


class MyStockResponse(BaseModel):
    my_stock_list: list[MyStockResponseValue]


class RichPickValue(BaseModel):
    name: str
    price: float
    rate: float


class RichPickResponse(RootModel[list[RichPickValue]]):
    pass


class RichPortfolioValue(BaseModel):
    name: str
    stock: dict[str, str]


class RichPortfolioResponse(RootModel[list[RichPortfolioValue]]):
    pass
