from pydantic import BaseModel, Field

class MarketIndexData(BaseModel):
    country: str = Field(..., description="Country of the market index")
    index_name: str = Field(..., description="Name of the market index")
    current_value: str = Field(..., description="Current value of the index")
    change_value: str = Field(..., description="The change in value from the previous close")
    change_percent: str = Field(..., description="The percentage change from the previous close")
    update_time: str = Field(..., description="The time at which the data was last updated")